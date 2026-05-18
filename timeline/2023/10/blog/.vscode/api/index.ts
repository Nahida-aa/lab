import { serve } from "@hono/node-server";
import app from "./app";
import { injectWebSocket } from "./ws/router";
import { serverHost, serverPort } from "../constants";

// console.log(`Starting server on port ${port}...`);

// 启动服务器
const server = serve(
  {
    fetch: app.fetch,
    port: serverPort,
  },
  (info) => {
    // 判断地址是否为 '::'（IPv6 通配），则打印 localhost
    const host =
      info.address === "::" || info.address === "0.0.0.0"
        ? serverHost
        : info.address;
    console.log(`Hono server is running: http://${host}:${info.port}/api`);
    console.log(`WebSocket available at: ws://${host}:${info.port}/ws`);
  },
);

// 注入 WebSocket 支持
injectWebSocket(server);
