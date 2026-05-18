"use server";
import { and, desc, eq, getTableColumns, inArray } from "drizzle-orm";
import { notificationReceiverFields, type NotificationType } from "./index.t";
import { db } from "@/lib/db";
import { notification, notificationReceiver, user } from "@/lib/db/schema";
import type { PgTable, PgTableWithColumns, TableConfig } from "drizzle-orm/pg-core";
import { userItemFields } from "@/lib/services/user/index.t";
import { pickColumns } from "@/lib/db/helpers";
import { withAuth } from "@/lib/client/action";

// 2. listNotification(userId, limit, offset)
export const _listNotification = async (
  authId: string,
  limit: number = 20,
  offset: number = 0,
) => {
  // const notifications = await db.query.notificationReceiver.findMany({
  //   columns: notificationReceiverFields, // 接收状态
  //   where: eq(notificationReceiver.userId, authId),
  //   with: {
  //     notification: {
  //       // 通知信息
  //       with: {
  //         sender: {
  //           // 发送者信息
  //           columns: userItemFields,
  //         },
  //       },
  //     },
  //   },
  //   orderBy: [desc(notification.createdAt)],
  //   limit,
  //   offset,
  // });

  const notifications = await db
    .select({
      // 通知信息
      ...getTableColumns(notification),
      // 接收状态
      receiver: pickColumns(notificationReceiver, notificationReceiverFields),
      // 发送者信息
      sender: pickColumns(user, userItemFields),
    })
    .from(notificationReceiver)
    .innerJoin(notification, eq(notificationReceiver.notificationId, notification.id))
    .leftJoin(user, eq(notification.senderId, user.id))
    .where(eq(notificationReceiver.userId, authId))
    .orderBy(desc(notification.createdAt))
    .limit(limit)
    .offset(offset);

  return notifications;
};
export const listNotification = withAuth(_listNotification);

export type ListNotificationOut = Awaited<ReturnType<typeof _listNotification>>;

// 已读 notifications
export const _markAsRead = async (authId: string, notificationIds: string[]) => {
  await db
    .update(notificationReceiver)
    .set({ isRead: true })
    .where(
      and(
        eq(notificationReceiver.userId, authId),
        inArray(notificationReceiver.id, notificationIds),
      ),
    );
};
export const markAsRead = withAuth(_markAsRead);
