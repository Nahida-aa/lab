import { demo } from "./schema";
import { createSelectSchema } from "drizzle-zod";
import z from "zod/v4";

const demoSelectZ1 = createSelectSchema(demo);
type DemoSelect1 = typeof demo.$inferSelect;

const demoZ2 = z.object({
  id: z.uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  slug: z.string(),
  name: z.string(),
  image: z.string().nullable(),
  summary: z.string().nullable(),
  description: z.string().nullable(),
});
type Demo = z.infer<typeof demoZ2>;

const demoItemZ1 = demoZ2.omit({
  description: true,
  createdAt: true,
  updatedAt: true,
});
type DemoItem1 = z.infer<typeof demoItemZ1>;
type DemoItem1_2 = Omit<Demo, "description" | "createdAt" | "updatedAt">;

const demoItemZ2 = demoZ2.pick({
  id: true,
  slug: true,
  name: true,
  summary: true,
  image: true,
});
type DemoItem2 = z.infer<typeof demoItemZ2>;
type DemoItem2_2 = Pick<Demo, "id" | "slug" | "name" | "summary" | "image">;

// 覆盖
const demoItemZ3 = demoZ2.extend({
  createdAt: z.string(),
  updatedAt: z.string(),
});
