import { AppEnv, createSubApp } from "@/api/app/create";
import { createNodeWebSocket } from "@hono/node-ws";
import { createMiddleware } from "hono/factory";
import { WSContext } from "hono/ws";
import { ClientWsData, CustomWSContext, ServerWsData } from "./types";
import { authMiddleware } from "../auth/middleware";
import { Context } from "hono";
import { session } from "../db/schema";


const wsMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  console.log('WebSocket middleware triggered');
  await next();
})

const app = createSubApp()

// 1. {channelId: Set<ws>} +  {userId: ws}(可选)
// 2. {channelId: Set<userId>} + {userId: ws} (推荐)
// 3. {channelId: Set<userId>} + {userId: wsId} + {wsId: ws} 没有有解决任何方案2无法解决的问题，反而使代码变得更绕, ws本身有 ws.id
// userId -> ws (登录用户，可接收所有频道消息)
const userConnections = new Map<string, CustomWSContext>();

// channelId -> Set<userId> 后续可以扩展 到 非内存中
// 这个 channelId == sql.channel.id, 但其他都不等同于 sql.channel， 一个用于实时通信的临时存储, 一个用于持久化存储
const channelMembers = new Map<string, Set<string>>();

export const sendToUser = (userId: string, data: ServerWsData) => {
  const ws = userConnections.get(userId);
  if (ws) {
    try {
      ws.send(JSON.stringify(data));
    } catch (error) {
      console.error("Error sending WebSocket message:", error);
    }
  }
}
// 广播函数 - 向 user list 发送消息
export const broadcastToUsers = (users: { id: string }[], data: ServerWsData) => {
  users.forEach(({ id }) => { sendToUser(id, data) });
}
// 广播函数 - 向channel内所有连接发送消息
export function broadcastToChannel(channelId: string, data: ServerWsData) {
  const userIds = channelMembers.get(channelId);
  if (userIds) {
    userIds.forEach(userId => { sendToUser(userId, data) });
  }
}

// 创建 WebSocket 支持
const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

// WebSocket 路由
const wsApp = app.get('/ws', authMiddleware, upgradeWebSocket(<C extends Context<AppEnv>>(c: C) => ({
  onOpen: (evt, ws) => {
    const userId = c.var.session.user.id
    console.log(`User ${userId} connected`);
    userConnections.set(userId, ws);
  },
  onMessage: (evt, ws) => {
    try {
      // console.log('evt._type:', evt.type);
      const data = JSON.parse(evt.data.toString()) as ClientWsData
      if (data.op === 'joinChannel') {
        const { channelId, userId } = data.d;
        channelMembers.set(channelId, new Set(
          [...(channelMembers.get(channelId) || []), userId]
        ));

        console.log(`User ${userId} joined channel ${channelId}`);

        // 通知其他用户有人加入
        broadcastToChannel(channelId, {
          op: 'userJoined',
          d: { userId, channelId }
        });
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  },
  onClose: (evt, ws) => {
    const userId = c.var.session.user.id
    console.log(`User ${userId} closed connection ${ws.raw.id}`);
    userConnections.delete(userId);
  },
  onError: (evt, ws) => {
    console.error('WebSocket error:', evt);
  }
})));

export { injectWebSocket, wsApp };
