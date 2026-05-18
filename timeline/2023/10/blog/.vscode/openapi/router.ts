// test openapi
import { createSubApp } from "../app/create";
import { createRoute, z } from "zod"; // available
import { jsonContent } from "./helpers/json-content";
import * as httpStatusCodes from "./http-status-codes"; //
import { messageObjectSchema } from "./helpers/res";

export const openapiApp = createSubApp()
  .openapi(
    createRoute({
      tags: ["openapi"],
      method: "get",
      path: "/openapi",
      responses: {
        [httpStatusCodes.OK]: {
          content: {
            "application/json": {
              schema: z.object({
                message: z.string(),
              }),
            },
          },
          description: "test",
        },
      },
    }),
    (c) => {
      return c.json({ message: "test" }, httpStatusCodes.OK);
    },
  )
  .openapi(
    createRoute({
      tags: ["openapi"],
      method: "post",
      path: "/openapi",
      responses: {
        [httpStatusCodes.OK]: jsonContent(
          z.object({
            message: z.string(),
          }),
          "test post",
        ),
      },
    }),
    (c) => {
      return c.json({ message: "test" });
    },
  )
  .openapi(
    createRoute({
      tags: ["openapi"],
      method: "put",
      path: "/openapi",
      responses: {
        [httpStatusCodes.OK]: jsonContent(messageObjectSchema(), "test put"),
      },
    }),
    (c) => {
      return c.json({ message: "test" });
    },
  );
