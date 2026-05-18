export const dev = process.env.NODE_ENV === "development";
export const appPort = process.env.PORT || "3000";
export const appUrl = process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${appPort}`;
export const serverHost = process.env.serverHost || "localhost";
// 转换端口为数字类型，默认为 3333
export const serverPort = Number(process.env.serverPort) || 3333;
export const serverBasePath = process.env.serverBasePath || "api";
export const serverUrl =
  process.env.serverUrl || `http${dev ? "" : "s"}://${serverHost}:${serverPort}`;
export const serverUrlPath = `${serverUrl}/${serverBasePath}`;

export const s3PublicUrl =
  process.env.S3_PUBLIC_URL || "https://pub-c119a9293e98420d82099567e7ecd825.r2.dev";

export const wsPath = "/api/socket.io";
export const socketIoAdminPassword = process.env.SOCKET_IO_ADMIN_PASSWORD || "admin";

// 版权 等 信息
// icp备案
export const icp = process.env.ICP || "<>ICP备2025123950号-1";
export const icpUrl =
  process.env.ICP_URL ||
  "http://www.beian.gov.cn/portal/registerSystemInfo?spm=5176.30371578.J_4NWEMkQ5nDwOgLi8EJmHs.59.1476154andlILy";
export const icpImg =
  process.env.ICP_IMG_URL ||
  "https://img.alicdn.com/tfs/TB1..50QpXXXXX7XpXXXXXXXXXX-40-40.png";
//
const owner = "Nahida-aa"; // 版权所属公司或个人
const currentYear = new Date().getFullYear();
export const copyright = `© 2025-${currentYear} ${owner} 版权所有 | ${icp}`;

// icp 许可证
// TODO
