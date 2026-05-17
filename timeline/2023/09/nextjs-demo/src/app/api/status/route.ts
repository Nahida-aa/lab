export const runtime = 'nodejs'
import { env } from "@/lib/env";
import { NextResponse } from "next/server";
// import { send } from "node:process";
// send?.('ready')
// console.log('Sent "ready" signal to pm2')
// process.send?.('ready')
// if (process.send) {
// } else {
//   console.log('process.send is not defined');
// }
// console.log('ready');
// console.log('src/app/api/status/route.ts');
export const GET = async () => {
  // 添加数据库连接检查、外部服务检查等
  const healthStatus = {
    version: env.NEXT_PUBLIC_VERSION,
    status: "ok",
    timestamp: new Date().toISOString(),
    port: process.env.PORT || "unknown",
    uptime: process.uptime(),
    APP_URL: env.NEXT_PUBLIC_APP_URL,
    // API_URL: env.NEXT_PUBLIC_API_URL
  };
  return NextResponse.json(healthStatus);
};
