import { Hono } from "hono"; // bun add hono
import { zValidator } from "@hono/zod-validator"; // bun add @hono/zod-validator
import z from "zod";

const demoZ = z.object({ a: z.coerce.number(), b: z.number() });

const app = new Hono().post(
  "/demo",
  zValidator("json", demoZ),
  async (c, next) => {
    // c.set('userId', 'aa')
    // c.var.userId = 'aa';
    await next();
  },
  (c) => {
    const { a, b } = c.req.valid("json");
    return c.json({ ret: a + b });
  },
);
