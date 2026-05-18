import { createSubApp } from "../app/create";
import { createRoute, z } from "@hono/zod-openapi";
import { jsonContent, resWith401 } from "../openapi/helpers/json-content";

import { honoAuth } from "../auth/middleware";
import { listNotification } from "../../lib/services/notification";
import { notificationSchema } from "../../lib/services/notification/index.t";
import { reqQueryLimitAndOffset } from "../openapi/helpers/req";

const app = createSubApp();
app.use(honoAuth);

app.openapi(
  createRoute({
    tags: ["notification"],
    method: "get",
    path: "/notifications",
    request: {
      query: reqQueryLimitAndOffset,
    },
    responses: resWith401(
      z.array(notificationSchema),
      "List user notifications successfully",
    ),
  }),
  async (c) => {
    const userId = c.var.session.user.id;
    const { limit, offset } = c.req.valid("query");

    return c.json(await listNotification(userId, limit, offset), 200);
  },
);

export default app;
