"use server";

import { withAuth } from "@/lib/client/action";
import { db, type Db, type Tx } from "@/lib/db";
import { pickColumns } from "@/lib/db/helpers";
import { channel, dmChannelMember, friend, user } from "@/lib/db/schema";
import { insertChannel, insertDmChannelMember } from "@/lib/db/service";
import { userItemFields } from "@/lib/services/user/index.t";
import { getUserStatus, listUserStatus } from "@/lib/ws/action";
import { and, asc, desc, eq, getTableColumns, inArray, ne, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

// C
export const __createDmChannel = async (tx: Tx, user1Id: string, user2Id: string) => {
  const [newChannel] = await insertChannel(tx, [{ type: "dm" }]);
  await insertDmChannelMember(tx, [
    {
      channelId: newChannel.id,
      userId: user1Id,
    },
    {
      channelId: newChannel.id,
      userId: user2Id,
    },
  ]);
  return newChannel;
};
export const _createDmChannel = async (authId: string, userId: string) => {
  // 开启事务
  return await db.transaction(async (tx) => {
    // 创建 DM 频道
    const newChannel = await __createDmChannel(tx, authId, userId);
    return newChannel;
  });
};

export const _listDmChannel = async (authId: string) => {
  const member = alias(dmChannelMember, "member");
  const channels = await db
    .select({
      ...getTableColumns(channel),
      user: {
        ...pickColumns(user, userItemFields),
        nickname: sql<string | null>`
            CASE
              WHEN ${friend.user1Id} = ${authId} THEN ${friend.nicknameFromUser1}
              ELSE ${friend.nicknameFromUser2}
            END
          `,
      },
    })
    .from(dmChannelMember)
    .innerJoin(channel, eq(channel.id, dmChannelMember.channelId))
    .innerJoin(member, and(eq(member.channelId, channel.id), ne(member.userId, authId)))
    .leftJoin(user, eq(user.id, member.userId))
    .leftJoin(
      friend,
      or(
        and(eq(friend.user1Id, user.id), ne(friend.user1Id, authId)),
        and(eq(friend.user2Id, user.id), ne(friend.user2Id, authId)),
      ),
    )
    .where(eq(dmChannelMember.userId, authId))
    .orderBy(desc(channel.updatedAt));
  const groupDmChannelIds = channels
    .filter((c) => c.type === "group_dm")
    .map((c) => c.id);
  // group_dm 频道
  const groupDmChannels = await db.query.channel.findMany({
    where: (t, { inArray }) => inArray(t.id, groupDmChannelIds),
    columns: { id: true },
    with: {
      members: {
        where: (t, { ne }) => ne(t.userId, authId),
        orderBy: (t, { asc }) => [asc(t.createdAt)],
        limit: 3,
        with: {
          user: {
            columns: userItemFields,
          },
        },
      },
    },
  });
  // 只需要 dm 频道的 user , 不需要 group_dm 频道的成员
  const userIds = channels
    .filter((c) => c.type === "dm" && c.user?.id)
    .map((c) => c.user!.id);
  // dm 获取用户状态
  const userStatuses = userIds.length > 0 ? await listUserStatus(userIds) : [];
  const ret = channels.map(({ user, ...c }) => {
    const status = user
      ? userStatuses.find((s) => s.userId === user.id)?.status
      : undefined;
    return {
      ...c,
      user: user ? { ...user, status } : null,
      members: groupDmChannels.filter((p) => p.id === c.id)[0].members,
    };
  });
  return ret;
};
export const listDmChannel = withAuth(_listDmChannel);
export type ListDmChannelOut = Awaited<ReturnType<typeof _listDmChannel>>;
