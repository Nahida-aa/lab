// import { createSubApp } from "@/api/app/create";
import { auth } from "@/lib/auth";
import { Hono } from "hono";
// import { createRoute } from "@hono/zod-openapi";
// import { jsonContent } from "@/api/openapi/helpers/json-content";
// import { messageObjectSchema } from "@/api/openapi/helpers/res";
// import { createMarkdownFromOpenApi } from "@scalar/openapi-to-markdown";
// import { cors } from "hono/cors";
export const authApp = new Hono()
  // .openapi(
  //   createRoute({
  //     tags: ["auth"],
  //     method: "get",
  //     path: "/test",
  //     responses: {
  //       200: jsonContent(messageObjectSchema(), "Test Auth OpenAPI endpoint"),
  //     },
  //   }),
  //   async (c) => {
  //     // const session = await auth.api.getSession(c.req.raw)
  //     // console.log('Auth session:', session);
  //     return c.json({
  //       message:
  //         "Better Auth OpenAPI documentation is available at /api/auth/reference",
  //     });
  //   },
  // )
  // .get("/llms.txt", async (c) => {
  //   // Get the OpenAPI document
  //   const openAPISchema = await auth.api.generateOpenAPISchema();
  //   const markdown = await createMarkdownFromOpenApi(openAPISchema);
  //   return c.text(markdown);
  // })
  // .use(
  //   "/*", // or replace with "*" to enable cors for all routes
  //   cors({
  //     origin: "http://localhost:3000", // replace with your origin
  //     allowHeaders: ["Content-Type", "Authorization"],
  //     allowMethods: ["POST", "GET", "OPTIONS"],
  //     exposeHeaders: ["Content-Length"],
  //     maxAge: 600,
  //     credentials: true,
  //   }),
  // )
  .on(["POST", "GET"], "/*", (c) => {
    return auth.handler(c.req.raw);
  });

// Better Auth 官方自己已经提供了 OpenAPI 文档路由 `${basePath}/reference` ==  /api/auth/reference

