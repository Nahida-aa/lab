// lib/ws/server.ts
import { createServer, type Server as HttpServer } from "node:http";
import { Server as IoServer } from "socket.io";
import { wsPath } from "../config";
import type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./types";

// TypeScript 全局声明（放文件顶部）
declare global {
  var io:
    | IoServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
    | undefined;
  // 全局在线用户跟踪（开发用内存；生产用 Redis/ioredis）
  var onlineUsers: Map<string, Set<string>>; // userId -> Set<socketId>
}

export const initOnlineUsers = () => {
  globalThis.onlineUsers = new Map<string, Set<string>>();
  return globalThis.onlineUsers;
};
export const isOnline = (userId: string) => {
  const wsIds = onlineUsers.get(userId);
  console.log("lib/ws/server.ts isOnline:", userId, wsIds, onlineUsers);
  if (wsIds) {
    return wsIds.size > 0;
  }
  return false;
};
export const listWsByUser = (userId: string) => {
  const wsIds = onlineUsers.get(userId);
  console.log("listWsByUser:", userId, wsIds, onlineUsers);
  if (wsIds) {
    return Array.from(wsIds);
  }
};
export const addOnlineUser = (userId: string, wsId: string) => {
  const wsIds = onlineUsers.get(userId) || new Set<string>();
  wsIds.add(wsId);
  onlineUsers.set(userId, wsIds);
};

// 初始化函数（只调用一次）
export function initIo(httpServer: HttpServer) {
  if (globalThis.io) {
    console.log("Socket.IO already initialized");
    return globalThis.io;
  }
  globalThis.io = new IoServer<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer, {
    path: wsPath, // 或 wsPath.app，如果你有
    addTrailingSlash: false,
    cors: {
      origin: ["https://admin.socket.io"],
      credentials: true,
    },
    maxHttpBufferSize: 1e6, // 1MB 限请求体
    pingTimeout: 15000, // 15s 心跳，防 zombie
    allowEIO3: true, // 兼容旧客户端，减 polling 开销
  });
  console.log("Socket.IO initialized");

  return globalThis.io;
}
