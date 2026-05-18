// create
import { createSchemaFactory } from "drizzle-zod";
import { z } from "zod"; // Extended Zod instance
export const { createSelectSchema, createInsertSchema, createUpdateSchema } =
  createSchemaFactory({ zodInstance: z });
