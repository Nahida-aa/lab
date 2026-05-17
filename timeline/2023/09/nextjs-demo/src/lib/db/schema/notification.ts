import { relations, type InferSelectModel } from 'drizzle-orm';
import { pgTable, varchar, index, timestamp, serial, integer, uniqueIndex, boolean, foreignKey, primaryKey, uuid, json, jsonb, text } from "drizzle-orm/pg-core"
import { timestamps, uuidCommon } from "./columnsHelpers"

export const systemNotification_table = pgTable("SystemNotification", {
  id: pgNanoid(),
  type: varchar("type", { length: 32 }).notNull(), // e.g., 'system'
  content: varchar("content", { length: 256 }).notNull(),
  receiver_id: text("receiver_id").notNull().references(() => user.id),
  is_read: boolean("is_read").default(false).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const friendNotification_table = pgTable("FriendNotification", {
  id: pgNanoid(),
  status: varchar("status", { length: 32 }).notNull().default('pending'), // e.g., 'pending', 'accepted', 'rejected'
  content: varchar("content", { length: 256 }).notNull(),
  receiver_id: text("receiver_id").notNull().references(() => user.id),
  sender_id: text("sender_id").notNull().references(() => user.id),
  is_read: boolean("is_read").default(false).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const friendNotificationRelations = relations(friendNotification_table, ({ one }) => ({
  receiver: one(user, {
    fields: [friendNotification_table.receiver_id],
    references: [user.id]
  }),
  sender: one(user, {
    fields: [friendNotification_table.sender_id],
    references: [user.id]
  }),
}));

import { group_table } from "./group";
import { user } from '@/modules/auth/schema/tables';
import { pgNanoid } from '../helpers';

export const groupNotification_table = pgTable("GroupNotification", {
  id: pgNanoid(),
  type: varchar("type", { length: 32 }).notNull(), // e.g., 'invite', 'exit', 'disband'
  content: varchar("content", { length: 256 }).notNull(),
  receiver_id: text("receiver_id").notNull().references(() => user.id),
  sender_id: text("sender_id").notNull().references(() => user.id),
  group_id: text("group_id").notNull().references(() => group_table.id),
  is_read: boolean("is_read").default(false).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const interactionMessage_table = pgTable("InteractionMessage", {
  id: pgNanoid(),
  type: varchar("type", { length: 32 }).notNull(), // e.g., 'like', 'mention'
  content: varchar("content", { length: 256 }).notNull(),
  receiver_id: text("receiver_id").notNull().references(() => user.id),
  sender_id: text("sender_id").notNull().references(() => user.id),
  is_read: boolean("is_read").default(false).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

