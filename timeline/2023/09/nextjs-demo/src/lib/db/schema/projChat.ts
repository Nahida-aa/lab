import { InferSelectModel, relations, sql } from "drizzle-orm";
import { pgTable, varchar, index, timestamp, serial, integer, uniqueIndex, boolean, foreignKey, primaryKey, uuid, bigint, text, jsonb } from "drizzle-orm/pg-core"
import { timestamps, uuidCommon, uuidWithTimestamps } from "./columnsHelpers"
import { tag as tag_table } from "./tag";
import { group_table } from "./group";
import { db } from "..";
import { createSelectSchema } from "drizzle-zod";
import { proj_table } from "./proj";
import { user } from "@/modules/auth/schema/tables";
import { pgNanoid } from "../helpers";

// 频道表
export const channel_table = pgTable("Channel", {
  id: pgNanoid(),
  project_id: text("project_id").notNull().references(() => proj_table.id),
  name: varchar("name", { length: 255 }).notNull(), // 
  class: varchar("class", { length: 64 }).notNull(), // 用户自定义分类, General
  type: varchar("type", { length: 64 }).notNull(), // 'text', 'voice', 'video', 'system'
  summary: varchar("summary", { length: 2048 }),
  description: varchar("description", { length: 65536 }),
  is_public: boolean("is_public").default(true).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  creator_id: text("created_by").notNull().references(() => user.id),
}, (table) => [
  index("ix_Channel_projectId").on(table.project_id),
]);

// 权限组表
export const permissionGroup_table = pgTable("PermissionGroup", {
  id: pgNanoid(),
  channel_id: text("channel_id").notNull().references(() => channel_table.id),
  name: varchar("name", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  creator_id: text("created_by").notNull().references(() => user.id),
}, (table) => [
  index("ix_PermissionGroup_channelId").on(table.channel_id),
]);
// 权限组成员表
export const permissionGroupMember_table = pgTable("PermissionGroupMember", {
  id: pgNanoid(),
  permission_group_id: text("permission_group_id").notNull().references(() => permissionGroup_table.id),
  user_id: text("user_id").notNull().references(() => user.id),
}, (table) => [
  index("ix_PermissionGroupMember_permissionGroupId").on(table.permission_group_id),
  index("ix_PermissionGroupMember_userId").on(table.user_id),
]);

// 权限表
export const permission_table = pgTable("Permission", {
  id: pgNanoid(),
  permission_group_id: text("group_id").notNull().references(() => permissionGroup_table.id),
  slug: varchar("slug", { length: 255 }).notNull(),
}, (table) => [
  index("ix_Permission_permissionGroupId").on(table.permission_group_id),
]);

// 聊天记录表
export const channelMessage_table = pgTable("ChannelMessage", {
  ...uuidWithTimestamps,
  channel_id: text("channel_id").notNull().references(() => channel_table.id),
  sender_id: text("sender_id").notNull().references(() => user.id),
  content: varchar("content").notNull(),
}, (table) => [
  index("ix_ChannelMessage_channelId").on(table.channel_id),
]);