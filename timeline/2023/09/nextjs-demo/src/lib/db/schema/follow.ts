import { pgTable, varchar, index, timestamp, serial, integer, uniqueIndex, boolean, foreignKey, primaryKey, uuid, text } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm/relations"
import { group_table } from "./group";
import { user } from "@/modules/auth/schema/tables";

export const follow_table = pgTable('Follow', {
  follower_id: text('follower_id').notNull().references(() => user.id),
  target_id: text('target_id').notNull(),
  target_type: varchar('target_type', { length: 16 }).notNull(), // 'user' or 'group'
  created_at: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  primaryKey({ columns: [table.follower_id, table.target_id], name: "Follow_pk" }),
  index('Follow_created_at_idx').on(table.created_at),
]);

export const followRelations = relations(follow_table, ({ one }) => ({
  follower: one(user, {
    fields: [follow_table.follower_id],
    references: [user.id],
    relationName: 'follower',
  }),
  target_user: one(user, {
    fields: [follow_table.target_id],
    references: [user.id],
    relationName: 'target_user',
  }),
  target_group: one(group_table, {
    fields: [follow_table.target_id],
    references: [group_table.id],
    relationName: 'target_group',
  }),
}));

export const friend_table = pgTable("Friend", {
  user_id: text("user_id").notNull().references(() => user.id),
  friend_id: text("friend_id").notNull().references(() => user.id),
  // status: varchar("status", { length: 16 }).notNull().default('pending'), // 'pending', 'accepted', 'rejected'
  is_pinned: boolean("is_pinned").default(false).notNull(), // 顶置状态
  created_at: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  primaryKey({ columns: [table.user_id, table.friend_id], name: "Friend_pk" }),
]);

export const friendRelations = relations(friend_table, ({ one }) => ({
  user: one(user, {
    fields: [friend_table.user_id],
    references: [user.id]
  }),
  friend: one(user, {
    fields: [friend_table.friend_id],
    references: [user.id]
  }),
}));