import { foreignKey, pgTable, primaryKey, text, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./columnsHelpers";
import { group_table } from "./group";
import { relations } from "drizzle-orm/relations";
import { user } from "@/modules/auth/schema/tables";

export const linkUserGroup = pgTable("LinkUserGroup", {
  ...timestamps,
  user_id: text("user_id").notNull(),
  group_id: text("group_id").notNull(),
  role: varchar({ length: 16 }).notNull(), // owner, admin, member, 
}, (table) => [
  foreignKey({
    columns: [table.group_id],
    foreignColumns: [group_table.id],
    name: "LinkUserGroup_group_id_fkey"
  }),
  foreignKey({
    columns: [table.user_id],
    foreignColumns: [user.id],
    name: "LinkUserGroup_user_id_fkey"
  }),
  primaryKey({ columns: [table.user_id, table.group_id], name: "LinkUserGroup_pkey" }),
]);

export const linkUserGroupRelations = relations(linkUserGroup, ({ one }) => ({
  group: one(group_table, {
    fields: [linkUserGroup.group_id],
    references: [group_table.id]
  }),
  user: one(user, {
    fields: [linkUserGroup.user_id],
    references: [user.id]
  }),
}));