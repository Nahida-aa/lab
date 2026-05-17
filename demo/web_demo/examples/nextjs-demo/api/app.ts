import { AuthTypeNotNull } from "@/lib/auth";
import { Hono } from "hono";
import { hc } from "hono/client";
import z from 'zod/v4'
import type { ErrorHandler, NotFoundHandler, ValidationTargets } from 'hono'
import { zValidator as zv } from '@hono/zod-validator' // pnpm i @hono/zod-validator
import { env, getRuntimeKey } from "hono/adapter";
import { poweredBy } from 'hono/powered-by' // 作用是在 HTTP 响应头中添加 X-Powered-By: Hono. 用于调试、监控或宣传框架
import { logger } from 'hono/logger'
import { HTTPException } from "hono/http-exception";
import { createMiddleware } from "hono/factory";
import { requestId } from "hono/request-id";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { DatabaseError } from "pg" // pnpm i pg
import { cors } from "hono/cors"
import { authApp } from "./auth/router";

export interface Env {
  Bindings: { // 用于 c.env 在 Cloudflare Worker 环境中
    NODE_ENV?: string; // 环境变量
  }
  Variables: { // 用于 c.var
    // logger: PinoLogger;
    session: AuthTypeNotNull;
  }
}
/**
 * 工厂型语法糖函数, 简化错误处理, 将 HTTP 错误作为 App 错误, 叫做 AppErr
 * @example
 * throw AppErr('Bad Request', 400) // Bad Request
 * throw AppErr('未登录', 401) // Not Authorized
 * throw AppErr('无权限操作此项目', 403) // Forbidden
 * throw AppErr('项目未找到', 404) // Not Found
 * throw AppErr('资源状态冲突', 409) // Conflict, 想删除一个正在使用中的对象,或者创建重复唯一键记录,or 当前版本不是你预期的版本
 * throw AppErr('请求内容校验失败', 422) // Unprocessable Entity, 例如 zod
 * throw AppErr('请求过于频繁', 429) // Too Many Requests
 */
export const AppErr = (message: string = 'Bad Request', status: ContentfulStatusCode = 400) => new HTTPException(status, { message })

export interface ErrRes {
  message: string;
  stack?: string; // Optional, only in development
}
export const newRouter = () => new Hono<Env>()
export const zValidator = <T extends z.ZodType, Target extends keyof ValidationTargets>(target: Target, schema: T) => zv(target, schema, (result, _) => {
  // console.log('zValidator::result:', result) // 验证json时, stack 可能追踪到  await next()
  if (!result.success) throw new HTTPException(422, result.error)
})

const demoApp = newRouter()
  .get('/list', zValidator('query', z.object({
    name: z.string(),
  })), (c) => c.json('list demos'))
  .post('/',
    zValidator('json', z.object({
      name: z.string(),
    })),
    zValidator('query', z.object({
      limit: z.coerce.number().optional(),
    })),
    (c) => {
      const json = c.req.valid('json')
      const query = c.req.valid('query')
      // console.log('demoApp::json:', json)
      return c.json({ json, query }, 201)
    })
  .get('/err', (c) => {
    throw new Error('error')
  })
  .get('c_var', (c) => {
    const c_var = c.var
    // c_var.
    return c.json({ c_var })
  })
  .get('/402', (c) => {
    throw AppErr('402', 402)
  })
  .get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

const app = new Hono<Env>().basePath('/api')
app.use(poweredBy())
app.use(requestId())
app.use(logger())
app.use(async (c, next) => {
  console.log(c.req.header())
  await next()
  console.log('resHeader:', Object.fromEntries(c.res.headers))
})
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:4000"], // 或根据需要设为 '*' 或 从环境变量读取
  allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
  credentials: true,
}))
app.onError((err, c) => {
  const { NODE_ENV } = env<{ NODE_ENV: string }>(c);
  console.log('app::NODE_ENV:', NODE_ENV)
  console.log('src/api/app.ts onError:cause:', err.cause)
  if (err.cause instanceof DatabaseError) {
    return c.json({
      message: err.cause.detail || err.cause.message,
      stack: NODE_ENV === "production" ? undefined : err.stack,
    }, 400)
  }
  return c.json({
    message: err.message,
    stack: NODE_ENV === "production" ? undefined : err.stack,
  }, err instanceof HTTPException ? err.status : 500)
})
app.notFound((c) => c.json({ message: `Not Found - ${c.req.path}` }, 404))
app.route('/auth', authApp)

// 希望 被 推断的部分 使用 链式
const routers = app
  .route('/demo', demoApp)
  .route('/demo1', demoApp)
  .route('/demo2', demoApp)
  .route('/demo3', demoApp)
  .route('/demo4', demoApp)
  .route('/demo5', demoApp)
  .route('/demo6', demoApp)
  .route('/demo7', demoApp)
  .route('/demo8', demoApp)
  .route('/demo9', demoApp)
  .route('/demo10', demoApp)

export default routers
export type AppType = typeof routers

