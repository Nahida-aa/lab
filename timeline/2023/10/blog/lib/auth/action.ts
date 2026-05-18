"use server";
import { auth } from ".";
import { headers } from "next/headers";
/** @deprecated Use `sApi.getSession`  **/
// 标记这个函数已弃用

export const getSession = async () => {
  const session = await auth.api.getSession({ headers: await headers() }); // pass the headers
  return session;
};

export type _AuthSession = Awaited<ReturnType<typeof getSession>>;
export type AuthSession = NonNullable<_AuthSession>; // 移除 null/undefined 分支
export type AuthUser = AuthSession["user"];
