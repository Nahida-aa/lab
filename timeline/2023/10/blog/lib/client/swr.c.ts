"use client";

import type { UserRes } from "@/lib/services/user/index.t";
import { getCommunityByProject } from "@/lib/services/community";
import { getProjectBySlug } from "@/lib/services/project";
import { listVersionWithFiles } from "@/lib/services/project/version";
import useSWR from "swr";

import { getUser, getUserByName, searchUser } from "@/lib/services/user";
import { listChannelMember } from "@/lib/services/community/member";
import type { ListIn } from "@/lib/client/zod";
import { listProjectMember } from "@/lib/services/project/member";
import type { ChannelMessageSelect } from "@/lib/db/service";
import useSWRInfinite from "swr/infinite";
import { listMsg } from "@/lib/services/community/msg";
import { key } from "@/lib/client/swr";
import { listChannel } from "@/lib/services/community/channel";
import { listNotification } from "@/lib/services/notification";
import { listFriend } from "@/lib/services/user/friend";
import { listDmChannel } from "@/lib/services/community/dm";
import { useLocalStorage } from "usehooks-ts";
import { listUserStatus, type ListUserStatusOut, type UserStatus } from "@/lib/ws/action";

export const fetcher = async (input: URL | RequestInfo, init?: RequestInit) => {
  const res = await fetch(input, init);
  if (!res.ok) {
    throw new Error((await res.json()).message);
  }
  return res.json();
};

export type FetcherParams = (string | number)[] | string;
export function swrAct<T>(action: (...args: any[]) => Promise<T>) {
  return async ([_, ...args]: FetcherParams) => action(...args);
}

export function useMsgs({ id, offset = 0, limit = 30 }: ListIn) {
  const { data, ...ret } = useSWRInfinite(
    key.msgs({ id, offset, limit }),
    ([_, arg]) => listMsg(arg),
    {
      fallbackData: [],
    },
  );
  return { data: data ?? [], ...ret };
}
export const useProject = (slug: string) => {
  // const ret = useSWR(key.project(slug), ([_, slug]) => getProjectBySlug(slug));
  const ret = useSWR(key.project(slug), swrAct(getProjectBySlug));
  return {
    project: ret.data!,
    projectError: ret.error,
    projectLoading: ret.isLoading,
    projectValidating: ret.isValidating,
    mutateProject: ret.mutate,
  };
};
export const useProjectMembers = (projectId?: string) => {
  const ret = useSWR(
    projectId ? key.projectMembers(projectId) : null, // ✅ 关键
    ([_, projectId]) => listProjectMember(projectId),
  );
  return {
    projectMembers: ret.data,
    projectMembersError: ret.error,
    projectMembersLoading: !projectId || ret.isLoading,
    projectMembersValidating: ret.isValidating,
    mutateProjectMembers: ret.mutate,
  };
};
export function useCommunityByProject(projectId: string) {
  const ret = useSWR(key.communityByProject(projectId), ([_, projectId]) =>
    getCommunityByProject(projectId),
  );
  return {
    community: ret.data!,
    communityError: ret.error,
    communityLoading: !projectId || ret.isLoading,
    communityValidating: ret.isValidating,
    mutateCommunity: ret.mutate,
  };
}
export function useChannels(communityId: string) {
  const ret = useSWR(key.channels(communityId), ([_, communityId]) =>
    listChannel(communityId),
  );
  return {
    channels: ret.data,
    channelsError: ret.error,
    channelsLoading: !communityId || ret.isLoading,
    channelsValidating: ret.isValidating,
    mutateChannels: ret.mutate,
  };
}
export function useVersions(projectId: string) {
  const ret = useSWR(key.versions(projectId), ([_, projectId]) =>
    listVersionWithFiles(projectId),
  );
  return {
    versions: ret.data!,
    versionsError: ret.error,
    versionsLoading: ret.isLoading,
    versionsValidating: ret.isValidating,
    mutateVersions: ret.mutate,
  };
}
export function useUser(id: string, fallbackData?: any) {
  const ret = useSWR(key.user(id), ([_, id]) => getUser(id), {
    fallbackData,
  });
  return {
    user: ret.data!,
    userError: ret.error,
    userLoading: ret.isLoading,
    userValidating: ret.isValidating,
    mutateUser: ret.mutate,
  };
}
export function useUserByName(username: string, fallbackData?: any) {
  const ret = useSWR(
    key.userByName(username),
    ([_, username]) => getUserByName(username),
    { fallbackData },
  );
  return {
    user: ret.data!,
    userError: ret.error,
    userLoading: ret.isLoading,
    userValidating: ret.isValidating,
    mutateUser: ret.mutate,
  };
}
export function useSearchUser(q?: string) {
  const ret = useSWR(q ? key.searchUser(q) : null, ([_, q]) => searchUser(q));
  return ret;
}
export function useChannelMembers(channelId: string) {
  const ret = useSWR(
    key.channelMembers(channelId),
    ([_, channelId]) => listChannelMember(channelId),
    {
      fallbackData: [],
    },
  );
  return {
    channelMembers: ret.data,
    channelMembersError: ret.error,
    channelMembersLoading: !channelId || ret.isLoading,
    channelMembersValidating: ret.isValidating,
    mutateChannelMembers: ret.mutate,
  };
}

export function useNotifications() {
  const ret = useSWR(key.notifications, listNotification);
  return ret;
}
export function useFriends() {
  const ret = useSWR(key.friends, listFriend);
  return ret;
}
export function useDmChannels() {
  const ret = useSWR(key.dmChannels, listDmChannel);
  return ret;
}

// KV 缓存 (localStorage)
const useUserStatusCache = () =>
  useLocalStorage<Record<string, UserStatus>>("userStatuses", {});
export function useUserStatuses(ids: string[]) {
  const [cache, setCache] = useUserStatusCache();
  const ret = useSWR(key.userStatuses(ids), ([_, ids]) => listUserStatus(ids), {
    fallbackData: ids.map((id) => ({ userId: id, status: cache[id] || "offline" })),
    revalidateOnFocus: false, // 失焦不重新请求
    onSuccess: (data) => {
      // SWR 回调：自动更新 KV（避免手动 if）
      const newCache = {
        ...cache,
        ...Object.fromEntries(data.map((item) => [item.userId, item.status])),
      };
      setCache(newCache); // 异步 OK，不影响当前 ret.data
    },
  });

  return {
    cache,
    setCache,
    ...ret,
  };
}
export function getUserStatusFromCache(
  id: string,
  userStatusCache: Record<string, string>,
) {
  return userStatusCache[id] || undefined;
}
