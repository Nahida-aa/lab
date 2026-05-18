// import { hc, type ClientResponse } from "hono/client";
// import type { AppType } from "..";
// import { serverPort, serverUrl } from "../../../constants";
// // import type { channelMessageApp } from "@/api/community/router/msg";
// // import type { uploadApp } from "../upload/router";
// // import type { channelApp } from "../community/channel/index/router";
// // import type { projectApp } from '../project/router';
// // import type { projectVersionApp } from "../project/router/version";
// import type { ListProjectQuery, ProjectUpdate } from "../../project/types";
// import type {
//   ProjectMemberStatus,
//   ProjectMemberUpdate,
// } from "../../project/types/member";
// import type { WsApp } from "../../ws/router";
// import type { ResponseFormat } from "hono/types";
// import type { UserSelect } from "../../db/service";
// import { username } from "better-auth/plugins";
// import type { UserUpdate } from "../../user/types";
// import { getUser } from "../../user/service";
// import type { MsgInput } from "../../community/types/msg.z";
// import type { FriendRequest } from "../../user/types/friend";
// // const baseUrl = process.env.

// let baseUrl: string;
// if (typeof window === "undefined") {
//   // Server-side, use the environment variable
//   baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
// } else {
//   // Client-side, construct the URL from window location
//   baseUrl = `${window.location.protocol}//${window.location.host}`;
// }

// const client = hc<AppType>(baseUrl);
// export const api = client.api;
// // // ws://host:3333/ws 不是 http://host:3333/api/ws , 因为 ws 是挂载, 但不被 hono 运行, 而是单独运行在 node server 上
// export const wsClient = hc<WsApp>(serverUrl).ws;
// // wsClient.ws.$ws()

// export interface ErrRes {
//   message: string;
//   stack?: string; // Optional, only in development
// }

// export async function handleRes<T>(
//   res: ClientResponse<T, number, ResponseFormat>,
// ): Promise<T> {
//   console.log("handleRes:", res.status);
//   if (!res.ok) {
//     let msg = res.statusText;
//     try {
//       const err = (await res.json()) as ErrRes;
//       msg = err.message ?? msg;
//     } catch {
//       // 如果不是 JSON 就保持 statusText
//     }
//     throw new Error(msg, { cause: res.status });
//   }
//   if (res.status === 204) {
//     return undefined as unknown as T;
//   }
//   return (await res.json()) as T;
// }
// export const projectApi = {
//   get: (slug: string) =>
//     api.project[":slug"].$get({ param: { slug } }).then(handleRes),
//   /** @deprecated Use `cApi.updateProject` instead. */
//   update: (id: string, json: ProjectUpdate) =>
//     api.project[":id"].$patch({ param: { id }, json }).then(handleRes),
//   /** @deprecated Use `cApi.listProjectMember` instead. */
//   listMember: (id: string, noStatus: ProjectMemberStatus[] = []) =>
//     api.project[":id"].members
//       .$get({ param: { id }, query: { noStatus } })
//       .then(handleRes),
// };
// export const versionApi = {
//   listWithFiles: (projectId: string) =>
//     api.version[":projectId"].listWithFiles
//       .$get({ param: { projectId } })
//       .then(handleRes),
// };
// export const communityApi = {
//   getByProject: (projectId: string) =>
//     api.community.$get({ query: { projectId } }).then(handleRes),
//   listChannel: (communityId: string) =>
//     api.channel.list.$get({ query: { communityId } }).then(handleRes),
// };

// // client api
// const cApi = {
//   // getUser: (username: string) => api.user.
//   // user
//   searchUser: (q: string) =>
//     api.user.search.$get({ query: { q } }).then(handleRes),
//   getUser: (id: string) =>
//     api.user[":id"].$get({ param: { id } }).then(handleRes),
//   getUserByName: (username: string) =>
//     api.user.by[":username"].$get({ param: { username } }).then(handleRes),
//   updateUser: (json: UserUpdate) => api.user.$patch({ json }).then(handleRes),
//   // friend
//   sendFriendRequest: (json: FriendRequest) =>
//     api.sendFriendRequest.$post({ json }).then(handleRes),
//   // project
//   listProject: ({ limit, offset, openSource, ...query }: ListProjectQuery) =>
//     api.project.$get({
//       query: {
//         limit: limit ? String(limit) : undefined,
//         offset: String(offset),
//         openSource: openSource ? String(openSource) : undefined,
//         ...query,
//       },
//     }),
//   listProjectMember: (id: string, noStatus: ProjectMemberStatus[] = []) =>
//     api.project[":id"].members
//       .$get({ param: { id }, query: { noStatus } })
//       .then(handleRes),
//   updateProject: (id: string, json: ProjectUpdate) =>
//     api.project[":id"].$patch({ param: { id }, json }).then(handleRes),
//   inviteJoinProject: (
//     id: string,
//     entityId: string,
//     entityType: "user" | "organization" = "user",
//   ) =>
//     api.project[":id"].invite_member
//       .$post({ param: { id }, json: { entityId, entityType } })
//       .then(handleRes),
//   updateProjectMember: (
//     id: string,
//     json: ProjectMemberUpdate,
//     projectId: string,
//   ) =>
//     api.project.member[":id"]
//       .$patch({
//         param: { id },
//         query: { projectId },
//         json,
//       })
//       .then(handleRes),
//   // community
//   sendChannelMessage: (json: MsgInput) =>
//     api.channel.message
//       .$post({
//         json,
//       })
//       .then(handleRes),
// };
// export default cApi;

// // const res = await api.community[':id'].join.$post({
// //   param: { id: 'string' }
// // })
// // res
// // api.

// // export type Client = ReturnType<typeof hc<typeof app>>
// // export const hcWithType = (...args: Parameters<typeof hc>): Client =>
// //   hc<typeof app>(...args)
// // export const cApi = hcWithType(baseUrl)
// // cApi
// // export const projectC = hc<typeof projectApp>(`${baseUrl}/api/project`);
// // export const projectVersionC = hc<typeof projectVersionApp>(`${baseUrl}/api/version`)
// // export const uploadC = hc<typeof uploadApp>(`${baseUrl}/api/upload`); // 仅用于测试
// // export const channelC = hc<typeof channelApp>(`${baseUrl}/api/channel`);
// // export const channelMessageC = hc<typeof channelMessageApp>(`${baseUrl}/api/channel`)
