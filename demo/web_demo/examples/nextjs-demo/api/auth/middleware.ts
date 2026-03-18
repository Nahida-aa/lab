import { auth, AuthType, AuthTypeNotNull } from "@/lib/auth";
// import { AppEnv } from "@/api/app/create";
import { createMiddleware } from "hono/factory";
import { Env } from "../app";

export const authMiddleware = createMiddleware<Env>(async (c, next) => {
  console.log("Auth middleware triggered");
  const session = await auth.api.getSession(c.req.raw);
  if (!session)
    return c.json({ message: "unauthenticated: 未经身份认证" }, 401);
  c.set("session", session);
  // console.log('Auth session:', session);

  await next();
});

export const adminAuthMiddleware = createMiddleware<Env>(async (c, next) => {
  const session = await auth.api.getSession(c.req.raw);
  if (!session) return c.json({ message: 'unauthenticated: 未经身份认证' }, 401);
  c.set('session', session);
  // console.log('Auth session:', session);
  console.log("Admin access check for user:", c.var.session.user.id);
  if (c.var.session.user.role !== "admin")
    return c.json({ message: "unauthorized: 无权访问" }, 403);
  await next();
});
