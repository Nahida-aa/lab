import { relations, type InferSelectModel } from 'drizzle-orm';
import { pgTable, varchar, index, timestamp, serial, integer, uniqueIndex, boolean, foreignKey, primaryKey, uuid, json, jsonb, text } from "drizzle-orm/pg-core"
import { timestamps, uuidCommon } from "./columnsHelpers"
import { group_table } from "./group";
import { user } from '@/modules/auth/schema/tables';

export const message_table = pgTable("Message", {
  id: pgNanoid(),
  chat_id: text("chat_id").notNull().references(() => chat_table.id),
  sender_id: text("sender_id").notNull().references(() => user.id),
  content: varchar("content").notNull(),
  ...timestamps,
}, (table) => [
  index('created_at_idx').on(table.created_at),
]);

export const messageRelations = relations(message_table, ({ one }) => ({
  chat: one(chat_table, {
    fields: [message_table.chat_id],
    references: [chat_table.id]
  }),
  sender: one(user, {
    fields: [message_table.sender_id],
    references: [user.id]
  }),
}));

export const chat_table = pgTable("Chat", {
  id: pgNanoid(),
  latest_message: varchar("latest_message", { length: 256 }), // 最新消息内容
  latest_message_count: integer("latest_message_count").default(0).notNull(), // 最新消息数量
  latest_message_timestamp: timestamp("latest_message_timestamp").defaultNow().notNull(), // 最新消息时间戳
  latest_sender_type: varchar("latest_sender_type", { length: 64 }).notNull(), // user, system
  latest_sender_id: text("latest_sender_id").references(() => user.id), // 最新消息发送者ID
  type: varchar("type", { length: 64 }).notNull(), // 'user' or 'group' or self
  group_id: text("group_id").references(() => group_table.id), // 仅在群聊时使用
  created_at: timestamp("created_at").defaultNow().notNull(),
});


export const chatRelations = relations(chat_table, ({ many, one }) => ({
  users: many(link_chat_user),
  messages: many(message_table),
  latest_sender: one(user, {
    fields: [chat_table.latest_sender_id],
    references: [user.id]
  }),
  group: one(group_table, {
    fields: [chat_table.group_id],
    references: [group_table.id]
  }),
}));

export const link_chat_user = pgTable("LinkChatUser", {
  chat_id: text("chat_id").notNull().references(() => chat_table.id),
  user_id: text("user_id").notNull().references(() => user.id),
  is_pinned: boolean("is_pinned").default(false).notNull(),
  target_user_id: text("target_user_id").references(() => user.id), // 新增字段
  target_group_id: text("target_group_id").references(() => group_table.id), // 新增字段
}, (table) => [
  primaryKey({ columns: [table.chat_id, table.user_id] })
]);

export const link_chat_user_relations = relations(link_chat_user, ({ one }) => ({
  chat: one(chat_table, {
    fields: [link_chat_user.chat_id],
    references: [chat_table.id]
  }),
  user: one(user, {
    fields: [link_chat_user.user_id],
    references: [user.id]
  }),
  target_user: one(user, {
    fields: [link_chat_user.target_user_id],
    references: [user.id]
  }),
  target_group: one(group_table, {
    fields: [link_chat_user.target_group_id],
    references: [group_table.id]
  }),
}))

function pgNanoid(): any {
  throw new Error('Function not implemented.');
}
