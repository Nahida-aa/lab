import { auth, AuthType, AuthTypeNotNull } from "../../lib/auth";
import { createMiddleware } from "hono/factory";
import type { AppEnv } from "../app/utils";

// 弃用
/** @deprecated */
export const honoAuth = createMiddleware<AppEnv>(async (c, next) => {
  console.log("honoAuth middleware triggered");
  const session = await auth.api.getSession(c.req.raw);
  if (!session) return c.json({ message: "unauthenticated: 未经身份认证" }, 401);
  c.set("session", session);
  // console.log('Auth session:', session);
  await next();
});
/** @deprecated */
export const honoSignIn = createMiddleware<AppEnv>(async (c, next) => {
  console.log("honoSignIn middleware triggered");
  const session = await auth.api.getSession(c.req.raw);
  if (!session) return c.json({ message: "unauthenticated: 未经身份认证" }, 401);
  else if (session.user.isAnonymous) return c.json({ message: "未登录" }, 401);
  c.set("session", session);
  // console.log('Auth session:', session)
  await next();
});

export const adminAuthMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const session = await auth.api.getSession(c.req.raw);
  if (!session) return c.json({ message: "unauthenticated: 未经身份认证" }, 401);
  c.set("session", session);
  // console.log('Auth session:', session);
  console.log("Admin access check for user:", c.var.session.user.id);
  if (c.var.session.user.role !== "admin")
    return c.json({ message: "unauthorized: 无权访问" }, 403);
  await next();
});
