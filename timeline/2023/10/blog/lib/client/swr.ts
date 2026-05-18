import type { ListIn } from "@/lib/client/zod";
import type { ChannelMessageSelect } from "@/lib/db/service";

export const key = {
  session: "/api/auth/get-session", // 已在 provider 中实现
  user: (id: string) => ["user", id],
  searchUser: (q: string) => ["searchUser", q] as const,
  userByName: (username: string) => ["userByName", username] as const,
  listFriendGroup: "listUserGroup",
  // project
  project: (slug: string) => ["project", slug] as const,
  projectMembers: (projectId: string) => ["projectMembers", projectId],
  versions: (projectId: string) => ["versions", projectId],
  communityByProject: (projectId: string) => ["communityByProject", projectId],
  channels: (communityId: string) => ["channels", communityId],
  channelMembers: (channelId: string) => ["channelMembers", channelId],
  msgs:
    ({ id, offset = 0, limit = 30 }: ListIn) =>
    (pageIndex: number, previousPageData: ChannelMessageSelect[]) => {
      if (previousPageData && !previousPageData.length) return null; // reached the end
      return ["msgs", { id, offset: pageIndex * limit, limit }] as const;
    },
  notifications: "notifications",
  friends: "friends",
  dmChannels: "dmChannels",
  userStatuses: (ids: string[]) => ["userStatuses", ids] as const,
};
