import { createSubApp } from "../../app/create";
import { broadcastToChannel } from "../../ws/router";

import { createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";
import { msgInputSchema } from "../types/msg.z";
import { jsonContent } from "../../openapi/helpers/json-content";
import { messageObjectSchema } from "../../openapi/helpers/res";
import { sendMsg } from "../service/msg";

import { IdUUIDParamsSchema, reqQueryLimitAndOffset } from "../../openapi/helpers/req";
import { asc, desc, eq } from "drizzle-orm";
import { honoAuth, honoSignIn } from "../../auth/middleware";
import { newRouter, v } from "../../app/utils";
import { idZ, offsetQuery } from "../../../lib/client/zod";
import { listMsg } from "@/lib/services/community/msg";

export const channelMessageApp = newRouter()
  .post("message", honoSignIn, v("json", msgInputSchema), async (c) => {
    // TODO: auth
    const message = c.req.valid("json");
    console.log("http:post:/message::Received message:", message);
    const savedMessage = await sendMsg(message);
    return c.json(savedMessage, 200);
  })
  .get(":id/messages", honoAuth, v("param", idZ), v("query", offsetQuery), async (c) => {
    // TODO: 细节 auth
    const { id } = c.req.valid("param");
    const { limit, offset } = c.req.valid("query");
    const messages = await listMsg({ id, limit, offset });
    return c.json(messages, 200);
  });
