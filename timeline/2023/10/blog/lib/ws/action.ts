"use server";

import { withAuth } from "@/lib/client/action";
import type { MsgOut } from "@/lib/services/community/msg.t";
import { isOnline } from "@/lib/ws/server";

export async function send2all(msg: MsgOut) {
  if (io) {
    io.emit("msg", msg);
    return true;
  }
}

export async function send(msg: MsgOut, target: string) {
  if (io) {
    io.to(target).emit("msg", msg);
    return true;
  }
}

export async function send2channel(msg: MsgOut, channelId: string) {
  return await send(msg, `channel_${channelId}`);
}

export const getUserStatus = async (id: string) => {
  return isOnline(id) ? "online" : "offline";
};
export type UserStatus = Awaited<ReturnType<typeof getUserStatus>>;
export const listUserStatus = withAuth(async (authId, ids: string[]) => {
  const statuses = await Promise.all(ids.map(getUserStatus));
  return ids.map((id, i) => ({ userId: id, status: statuses[i] }));
});
export type ListUserStatusOut = Awaited<ReturnType<typeof listUserStatus>>;
