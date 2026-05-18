import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const demo = pgTable("demo", {
  id: uuid().primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).$onUpdate(() => new Date().toISOString()).notNull(),
  username: text("username").notNull().unique().default(`anon_${nanoid()}`),
  name: text("name").notNull(),
  image: text("image"),
  summary: text("summary"),
  description: text("description"),
})