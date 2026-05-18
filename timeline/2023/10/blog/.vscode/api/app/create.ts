import { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import { requestId } from "hono/request-id";
// import pinoHttp from "pino-http"; // Edge Runtime 不支持
import { logger } from "hono/logger";
// import { pino } from "pino";
// import { pinoLogger } from 'hono-pino' // Pino is designed for Node.js and supports browser environments. 翻译: Pino 旨在用于 Node.js 并支持浏览器环境。
// import pretty from 'pino-pretty'; // Pretty print for Pino logs, useful for development
import { env } from "hono/adapter";
import { cors } from "hono/cors";
import { createMiddleware } from "hono/factory";
import { MiddlewareHandler } from "hono/types";
import defaultHook from "../openapi/default-hook";
import { serverBasePath } from "../../constants";
import { AuthTypeNotNull } from "../../lib/auth";
import { AppOpenAPI } from "../openapi/type";
import { AppEnv } from "./utils";

export type { AppEnv } from "./utils";

export function createSubApp(middlewareHandler?: MiddlewareHandler<AppEnv>) {
  const app = new OpenAPIHono<AppEnv>({
    strict: false, // 关闭严格模式，允许未定义的路径, /hello <- /hello or /hello/
    defaultHook, // 恢复 defaultHook，用于处理验证错误
  });
  // configJsonRes(app)
  if (middlewareHandler)
    return app.use(middlewareHandler) as OpenAPIHono<AppEnv>;

  return app;
}
