import { newRouter } from "../../app/utils";
import { searchQuery, uuidZ, uuidZOf, v } from "../../../lib/client/zod";
import { honoAuth } from "../../auth/middleware";
import type { ChannelMemberWithPermissions } from "../../../lib/services/community/member.t";
import {
  canViewChannel,
  listChannelMember,
  searchChannelMembers,
} from "../../../lib/services/community/member";

export const channelApp = newRouter()
  .get("/list", v("query", uuidZOf("communityId")), async ({ req, json }) => {
    const { communityId } = req.valid("query");
    return json(await listChannelByCommunityId(communityId));
  })
  .get(
    "/:id/members",
    honoAuth,
    v("param", uuidZ),
    v("query", searchQuery),
    async ({ req, var: { session }, json }) => {
      const { id: channelId } = req.valid("param");
      const { limit, q } = req.valid("query");
      const user = session.user;

      if (!user.isAnonymous) {
        // 检查登录用户是否有权限查看频道
        const canView = await canViewChannel(channelId, user.id);
        if (!canView) return json({ message: "没有权限查看此频道" }, 403);
      }

      let members: ChannelMemberWithPermissions[];

      if (q) {
        // 搜索成员
        members = await searchChannelMembers(channelId, q, limit);
      } else {
        members = await listChannelMember(channelId);
      }

      return json(
        {
          channelId,
          members,
          total: members.length,
        },
        200,
      );
    },
  );
function listChannelByCommunityId(communityId: string): any {
  throw new Error("Function not implemented.");
}
