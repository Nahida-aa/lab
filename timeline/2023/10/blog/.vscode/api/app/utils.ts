import { poweredBy } from "hono/powered-by"; // 作用是在 HTTP 响应头中添加 X-Powered-By: Hono. 用于调试、监控或宣传框架
// import test from '@/server/routes/test/index'
// import auth from "@/api/auth/router";
import { Hono, type ValidationTargets } from "hono";
import { auth, type AuthTypeNotNull } from "../../lib/auth";
import { logger } from "hono/logger";
import { requestId } from "hono/request-id";
import { env } from "hono/adapter";
import { HTTPException } from "hono/http-exception";
import postgres from "postgres";
import { cors } from "hono/cors";
import { zValidator as zv } from "@hono/zod-validator"; // pnpm i @hono/zod-validator
import type { z } from "zod";
import type { BlankEnv, BlankSchema } from "hono/types";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { AppError } from "@/lib/types";

export interface AppEnv {
  Bindings: {
    // 用于 c.env 在 Cloudflare Worker 环境中
    NODE_ENV?: string; // 环境变量
  };
  Variables: {
    // 用于 c.var
    // logger: PinoLogger;
    session: AuthTypeNotNull;
  };
}

// const app0 = new Hono().get("/hello", async (c) => {})

export const newRouter = () => new Hono<AppEnv>();

export const newApp = (): Hono<BlankEnv, BlankSchema, ""> => {
  const app = new Hono();
  app.use(poweredBy());
  app.use(requestId());
  app.use(logger());
  app.use(async (c, next) => {
    console.log(c.req.header());
    await next();
    console.log("resHeader:", Object.fromEntries(c.res.headers));
  });
  app.use(
    cors({
      origin: ["http://localhost:3000", "http://localhost:4000"], // 或根据需要设为 '*' 或 从环境变量读取
      allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    }),
  );
  app.onError((err, c) => {
    const { NODE_ENV } = env<{ NODE_ENV: string }>(c);
    console.log("app::NODE_ENV:", NODE_ENV);
    console.log("src/api/app.ts onError:cause:", err.cause);
    if (err.cause instanceof postgres.PostgresError) {
      return c.json(
        {
          message: err.cause.detail || err.cause.message,
          stack: NODE_ENV === "production" ? undefined : err.stack,
        },
        400,
      );
    }
    return c.json(
      {
        message: err.message,
        stack: NODE_ENV === "production" ? undefined : err.stack,
      },
      err instanceof HTTPException || err instanceof AppError
        ? (err.status as ContentfulStatusCode)
        : 500,
    );
  });
  app.notFound((c) => c.json({ message: `Not Found - ${c.req.path}` }, 404));
  app.on(["POST", "GET"], "/api/auth/*", (c) => {
    return auth.handler(c.req.raw);
  }); // `${basePath}/reference` ==  /api/auth/reference
  // app.route("/api/auth", auth)
  return app;
};

export const v = <T extends z.ZodType, Target extends keyof ValidationTargets>(
  target: Target,
  schema: T,
) =>
  zv<T, Target, AppEnv, string>(target, schema, (result, _) => {
    // console.log('zValidator::result:', result) // 验证json时, stack 可能追踪到  await next()
    if (!result.success) throw new HTTPException(422, result.error);
  });
