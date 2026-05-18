import type { AppEnv } from "../app/create";
import { createNodeWebSocket } from "@hono/node-ws";
import type { ClientWsData, CustomWSContext, ServerWsData } from "./types";
import type { Context } from "hono";
import { honoAuth } from "../auth/middleware";
import { newRouter } from "../app/utils";
import { listDmChannelByUserId } from "../../lib/services/community/dm";
import { listCommunityByUserId } from "@/lib/services/community";

const app = newRouter();

// 1. {channelId: Set<ws>} +  {userId: ws}(可选)
// 2. {channelId: Set<userId>} + {userId: ws} (推荐)
// 3. {channelId: Set<userId>} + {userId: wsId} + {wsId: ws} 没有有解决任何方案2无法解决的问题，反而使代码变得更绕, ws本身有 ws.id
// userId -> ws (登录用户，可接收所有频道消息)
const userConnections = new Map<string, CustomWSContext>();
// channelId -> Set<userId> 后续可以扩展 到 非内存中
// 这个 channelId == sql.channel.id, 但其他都不等同于 sql.channel， 一个用于实时通信的临时存储, 一个用于持久化存储
const channelMembers = new Map<string, Set<string>>();
// TODO: 权限系统, 根据权限 过滤 userId
const communityMembers = new Map<string, Set<string>>();

export const sendToUser = (userId: string, data: ServerWsData) => {
  const ws = userConnections.get(userId);
  if (ws) {
    try {
      ws.send(JSON.stringify(data));
    } catch (error) {
      console.error("Error sending WebSocket message:", error);
    }
  }
};
// 广播函数 - 向 user list 发送消息
export const broadcastToUsers = (users: { id: string }[], data: ServerWsData) => {
  users.forEach(({ id }) => {
    sendToUser(id, data);
  });
};
// 广播函数 - 向channel内所有连接发送消息, 用于私聊\群私聊
export const broadcastToChannel = (channelId: string, data: ServerWsData) => {
  const userIds = channelMembers.get(channelId);
  if (userIds) {
    userIds.forEach((userId) => {
      sendToUser(userId, data);
    });
  }
};
export const broadcastToCommunity = (communityId: string, data: ServerWsData) => {
  const userIds = communityMembers.get(communityId);
  console.log(`Broadcasting to community ${communityId}, userIds: ${userIds}`);
  if (userIds) {
    userIds.forEach((userId) => {
      sendToUser(userId, data);
    });
  }
};
export const isOnline = (userId: string) => !!userConnections.get(userId);

// 创建 WebSocket 支持
const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

// WebSocket 路由 - 认证用户自动加入可访问频道
const wsApp = app.get(
  "/ws",
  honoAuth,
  upgradeWebSocket(<C extends Context<AppEnv>>(c: C) => ({
    onOpen: async (evt, ws) => {
      const user = c.var.session.user; // 一定存在, 不要检查

      console.log(`User ${JSON.stringify(user)} connected ${JSON.stringify(ws.raw)}`);
      userConnections.set(user.id, ws);

      // 非匿名用户：自动加入所有可访问的频道
      if (!user.isAnonymous) {
        const communityList = await listCommunityByUserId(user.id);
        const dmChannelList = await listDmChannelByUserId(user.id);
        console.log(`User ${user.id} :`, communityList);

        for (const community of communityList) {
          const existingMembers = communityMembers.get(community.id) || new Set();
          existingMembers.add(user.id);
          communityMembers.set(community.id, existingMembers);
          console.log(`User ${user.id} auto-enter community ${community.id}`);
        }
        for (const channel of dmChannelList) {
          const existingMembers = channelMembers.get(channel.id) || new Set();
          existingMembers.add(user.id);
          channelMembers.set(channel.id, existingMembers);
          console.log(`User ${user.id} auto-enter dm channel ${channel.id}`);
        }
      }
    },
    onMessage: async (evt, ws) => {
      try {
        const data = JSON.parse(evt.data.toString()) as ClientWsData;
        if (data.op === "enterCommunity") {
          const { communityId, userId } = data.d;
          // 检查权限 不用检查 匿名用户的权限
          // 加入频道
          const existingMembers = communityMembers.get(communityId) || new Set();
          existingMembers.add(userId);
          communityMembers.set(communityId, existingMembers);

          console.log(`User ${userId} Enter community ${communityId}`);

          // 通知 用户 有临时用户进入
          broadcastToCommunity(communityId, {
            op: "userEnter",
            d: { userId, communityId },
          });
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    },
    onClose: (evt, ws) => {
      const userId = c.var.session.user.id;

      console.log(`User ${userId} closed connection ${ws.raw.id}`);
      userConnections.delete(userId);
      // 从社区中移除用户
      for (const [communityId, members] of communityMembers.entries()) {
        if (members.has(userId)) {
          members.delete(userId);
          if (members.size === 0) {
            communityMembers.delete(communityId);
          }
        }
      }
      // 从所有频道中移除用户
      for (const [channelId, members] of channelMembers.entries()) {
        if (members.has(userId)) {
          members.delete(userId);
          if (members.size === 0) {
            channelMembers.delete(channelId);
          }
        }
      }
    },
    onError: (evt, ws) => {
      console.error("WebSocket error:", evt);
    },
  })),
);
type WsApp = typeof wsApp;
export { injectWebSocket, wsApp, type WsApp };
