import { createSubApp } from "../app/create";
import { createRoute, z } from "@hono/zod-openapi";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import { jsonContent, jsonContentRequest } from "../openapi/helpers/json-content";
import { AppErr } from "../openapi/middlewares/on-error";
import { honoSignIn } from "../auth/middleware";
import { messageObjectSchema } from "../openapi/helpers/res";
import { generatePresignedUploadUrl } from "../../lib/upload/s3-storage";
import { sanitizeFilename } from "../../lib/upload/utils";
import { allowedTypes, uploadTypes } from "./service";
import { newRouter, v } from "../app/utils";
import { genSignedUrlJson } from "@/lib/upload/types";
import { _getSignedUrls } from "@/lib/upload/actions";

export const generatePresignedUrlSchema = z.object({
  uploadType: z.enum(uploadTypes).default("other"),
  files: z.array(
    z.object({
      name: z.string().min(1, "文件名不能为空").max(255, "文件名过长"),
      type: z.string().min(1, "文件类型不能为空"),
      size: z
        .number()
        .int()
        .min(1, "文件大小必须大于0")
        .max(100 * 1024 * 1024, "文件大小不能超过100MB"), // 100MB限制
    }),
  ),
});
export type GeneratePresignedUrlSchemaType = z.infer<typeof generatePresignedUrlSchema>;

// 预签名URL响应 schema
const presignedUrlSchema = z.object({
  // expiresIn: z.number().openapi({ example: 3600 }),
  // maxFileSize: z.number().openapi({ example: 104857600 }),
  fileId: z.string().openapi({ example: "file123" }),
  name: z.string().openapi({ example: "mod.jar" }),
  uploadUrl: z.string().openapi({ example: "https://r2.example.com/presigned-url" }),
  storageKey: z.string().openapi({ example: "projects/abc123/versions/1.0.0/mod.jar" }),
});
export type PresignedUrlSchemaType = z.infer<typeof presignedUrlSchema>;
export const uploadApp = newRouter().post(
  "/getSignedUrls",
  honoSignIn,
  v("json", genSignedUrlJson),
  async (c) => {
    const authId = c.var.session.user.id;
    const data = c.req.valid("json");
    const signedUrls = await _getSignedUrls(authId, data);
    return c.json(signedUrls, 200);
  },
);
