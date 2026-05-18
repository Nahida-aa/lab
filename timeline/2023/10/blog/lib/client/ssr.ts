// server api
import { cache } from "react";
// import {
//   getProject,
//   getProjectById,
//   listUserProject,
//   statUserProject,
// } from "../../project/service";
// import { listProjectMember } from "../../project/service/member";
// import { getUser, getUserByName, updateUser } from "../../user/service";
// import { _getFriend } from "../../friend/service";
import { getSession } from "@/lib/auth/action";
import { AppError } from "@/lib/types";
import {
  getProject,
  getProjectBySlug,
  listUserProject,
  statUserProject,
} from "@/lib/services/project";
import { listProjectMember } from "@/lib/services/project/member";
import { listChannelMember } from "@/lib/services/community/member";
import { getCommunityByProject } from "@/lib/services/community";
import { listChannel } from "@/lib/services/community/channel";
import { listMsg } from "@/lib/services/community/msg";
import { getUserByName } from "@/lib/services/user";
import { _getFriend } from "@/lib/services/user/friend";
import { _listNotification, listNotification } from "@/lib/services/notification";

type SafeResult<T> = {
  data?: T;
  error?: AppError;
};

export function safe<T extends (...args: any[]) => Promise<any>>(fn: T) {
  return async (...args: Parameters<T>): Promise<SafeResult<Awaited<ReturnType<T>>>> => {
    try {
      const data = await fn(...args);
      return { data };
    } catch (err) {
      console.error("safe:", err);
      if (err instanceof AppError) return { error: err };
      return { error: new AppError("Internal Server Error", 500, err) };
    }
  };
}
export function ssrFetch<T extends (...args: any[]) => Promise<any>>(fn: T) {
  return cache(safe(fn));
}
// Warning:仅用于 ssr fetch data
const ssr = {
  getSession: ssrFetch(getSession),
  statUserProject: ssrFetch(statUserProject),
  // getUser: ssrFetch(getUser),
  getUserByName: ssrFetch(getUserByName),
  _getFriend: ssrFetch(_getFriend),
  listUserProject: ssrFetch(listUserProject),
  getProjectBySlug: ssrFetch(getProjectBySlug),
  getCommunityByProject: ssrFetch(getCommunityByProject),
  listChannel: ssrFetch(listChannel),
  listMsg: ssrFetch(listMsg),
  getProject: ssrFetch(getProject),
  listProjectMember: ssrFetch(listProjectMember),
  listChannelMember: ssrFetch(listChannelMember),
  // notification
  listNotification: ssrFetch(_listNotification),
};
export default ssr;

// export namespace SApi {
//   export const getUser = cache(getUserByName)
// }
