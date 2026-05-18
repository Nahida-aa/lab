export const uploadTypes = [
  "avatar",
  "project_icon",
  "project_gallery",
  "mod_file",
  "resource_pack",
  "other",
] as const;
export type UploadType = (typeof uploadTypes)[number];
// 验证文件类型
export const allowedTypes = {
  avatar: ["image/jpeg", "image/png", "image/webp"],
  project_icon: ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
  project_gallery: ["image/jpeg", "image/png", "image/webp"],
  mod_file: [
    "application/java-archive",
    "application/zip",
    "application/x-zip-compressed",
  ],
  resource_pack: ["application/zip", "application/x-zip-compressed"],
  other: [], // 允许所有类型
};
