"use server";
import {
  follow,
  friend,
  user,
  notification,
  notificationReceiver,
  friendGroup,
  friendGroupLink,
} from "@/lib/db/schema";
import { eq, and, or, getTableColumns, ne, sql } from "drizzle-orm";
import type { FriendItem, FriendRequest } from "./friend.t";
import { db, type Db } from "@/lib/db";
import { authMw, defAct, withAuth, withAvatar, withUser } from "@/lib/client/action";
import { AppErr } from "@/lib/types";
import { isOnline, listWsByUser } from "@/lib/ws/server";
import type { AuthUser } from "@/lib/auth/action";
import { getDefaultAvatar } from "@/lib/utils/avatar";
import { buildNotificationInsert } from "@/lib/services/notification/index.t";
import { userItemFields } from "@/lib/services/user/index.t";
import { pickColumns } from "@/lib/db/helpers";
import { __createDmChannel } from "@/lib/services/community/dm";

export async function _acceptFriendRequest(authId: string, friendTableId: string) {
  return await db.transaction(async (tx) => {
    // 更新现有请求状态为accepted
    const friendList = await tx
      .update(friend)
      .set({ status: "accepted" })
      .where(and(eq(friend.id, friendTableId), eq(friend.status, "pending")))
      .returning();
    if (friendList.length === 0) {
      throw AppErr("没有找到对应的好友请求", 404);
    }
    // 创建私聊频道
    await __createDmChannel(tx, friendList[0].user1Id, friendList[0].user2Id);
    return friendList;
  });
}
export const acceptFriendRequest = withAuth(_acceptFriendRequest);

export async function rejectFriendRequest(
  userId: string,
  senderId: string,
  friendTableId: string,
) {
  // 更新请求状态为rejected
  await db.delete(friend).where(eq(friend.id, friendTableId));

  // 发送拒绝通知
}

// R
export const _getFriend = async (userId: string, authId: string) => {
  return await db.query.friend.findFirst({
    where: or(
      and(eq(friend.user1Id, userId), eq(friend.user2Id, authId)),
      and(eq(friend.user1Id, authId), eq(friend.user2Id, userId)),
    ),
  });
};
// export async function listFriend(authId: string): Promise<FriendItem[]> {
//   // 查询所有已接受的好友关系，并关联用户信息
//   const friends = await db
//     .select({
//       id: friend.id,
//       user1Id: friend.user1Id,
//       user2Id: friend.user2Id,
//       user1: {
//         id: user.id,
//         username: user.username,
//         displayUsername: user.displayUsername,
//         image: user.image,
//       },
//       user2: {
//         id: user.id,
//         username: user.username,
//         displayUsername: user.displayUsername,
//         image: user.image,
//       },
//     })
//     .from(friend)
//     .leftJoin(user, eq(friend.user1Id, user.id))
//     .leftJoin(user, eq(friend.user2Id, user.id))
//     .where(
//       and(
//         or(eq(friend.user1Id, authId), eq(friend.user2Id, authId)),
//         eq(friend.status, "accepted"),
//       ),
//     );

//   // 转换为 Friend 类型，排除当前用户，只保留好友信息
//   return friends;
// }

export const _removeFriend = async (authId: string, userId: string) => {
  await db
    .delete(friend)
    .where(
      and(
        or(
          and(eq(friend.user1Id, userId), eq(friend.user2Id, authId)),
          and(eq(friend.user1Id, authId), eq(friend.user2Id, userId)),
        ),
        eq(friend.status, "accepted"),
      ),
    );
};
export const removeFriend = withAuth(_removeFriend);

export async function _listFriendGroup(authId: string) {
  return await db.select().from(friendGroup).where(eq(friendGroup.userId, authId));
}
/** 列出 用户有哪些 好友 标签(分组) */
export const listFriendGroup = withAuth(_listFriendGroup);

export async function _sendFriendRequest(
  { id: authId, username, image }: AuthUser,
  { targetId, msg, groupName, nickname }: FriendRequest,
) {
  // 检查是否已经有好友关系或待处理的请求
  const [friendItem] = await db
    .select()
    .from(friend)
    .where(
      or(
        and(eq(friend.user1Id, authId), eq(friend.user2Id, targetId)),
        and(eq(friend.user1Id, targetId), eq(friend.user2Id, authId)),
      ),
    )
    .limit(1);

  if (friendItem) {
    const status = friendItem.status;
    if (status === "accepted") {
      throw AppErr("已经是好友了", 400);
    } else if (status === "pending") {
      throw AppErr("已经发送过好友请求，请等待对方处理", 400);
    } else if (status === "rejected") {
      throw AppErr("好友请求被拒绝", 400);
    } else if (status === "blocked") {
      throw AppErr("无法发送好友请求", 400);
    }
  }

  return await db.transaction(async (tx) => {
    // 创建好友请求（只创建一条记录，状态为pending）
    const [friendItem] = await tx
      .insert(friend)
      .values({
        user1Id: authId, // 发送请求的用户
        user2Id: targetId, // 接收请求的用户
        status: "pending",
        reason: "manual_request",
        nicknameFromUser1: nickname,
      })
      .returning();
    let friendGroupId = await tx.query.friendGroup
      .findFirst({
        where: and(eq(friendGroup.userId, authId), eq(friendGroup.name, groupName)),
      })
      .then((group) => group?.id);

    if (!friendGroupId) {
      const newGroup = await __createGroup(authId, groupName, tx);
      friendGroupId = newGroup.id;
    }
    await tx.insert(friendGroupLink).values({
      friendGroupId,
      friendId: friendItem.id,
    });
    const [newNotification] = await tx
      .insert(notification)
      .values(
        buildNotificationInsert("friend_request", authId, {
          targetId,
          friendTableId: friendItem.id,
          username: username!,
          image,
          msg,
        }),
      )
      .returning();
    await tx.insert(notificationReceiver).values({
      notificationId: newNotification.id,
      userId: targetId,
    });
    const wsIds = listWsByUser(targetId);
    if (wsIds) {
      io?.to(wsIds).emit("friend_request", {
        senderId: authId,
        friendTableId: friendItem.id,
        username: username!,
        image,
        msg,
      });
    }
    return friendItem;
  });
}
export const sendFriendRequest = withUser(_sendFriendRequest);

export async function __createGroup(userId: string, name: string, db: Db) {
  const [newGroup] = await db
    .insert(friendGroup)
    .values({
      userId,
      name,
    })
    .returning();
  return newGroup;
}
// action
export const createFriendGroup = withAuth(async (authId: string, name: string) => {
  return await __createGroup(authId, name, db);
});

// action listFriend
export const listFriend = withAuth(async (authId: string) => {
  const friends = await db
    .select({
      // ...getTableColumns(friend),
      id: friend.id,
      createdAt: friend.createdAt,
      updatedAt: friend.updatedAt,
      user1Id: friend.user1Id,
      user2Id: friend.user2Id,
      status: friend.status,
      reason: friend.reason,
      nickname: sql<string | null>`
      CASE
        WHEN ${friend.user1Id} = ${authId} THEN ${friend.nicknameFromUser1}
        ELSE ${friend.nicknameFromUser2}
      END
    `,
      user: pickColumns(user, userItemFields),
      friendGroup: getTableColumns(friendGroup),
    })
    .from(friendGroupLink)
    .innerJoin(friendGroup, eq(friendGroupLink.friendGroupId, friendGroup.id))
    .innerJoin(friend, eq(friendGroupLink.friendId, friend.id))
    .innerJoin(
      user,
      or(
        and(eq(friend.user1Id, user.id), ne(friend.user1Id, authId)),
        and(eq(friend.user2Id, user.id), ne(friend.user2Id, authId)),
      ),
    )
    .where(and(eq(friendGroup.userId, authId), eq(friend.status, "accepted")));

  return friends.map((item) => ({
    ...item,
    isOnline: isOnline(item.user.id),
  }));
});
