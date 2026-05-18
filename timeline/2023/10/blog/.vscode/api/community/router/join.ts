import { newRouter } from "../../app/utils";
import { withSignIn } from "../../auth/middleware";
import { discoverAndDirectlyJoin } from "../../../lib/services/community/join";
import { uuidZ, v } from "../../../lib/client/zod";

export const communityJoinApp = newRouter().post(
  "/:id/join",
  withSignIn,
  v("param", uuidZ),
  async (c) => {
    const ret = await discoverAndDirectlyJoin(
      c.req.valid("param").id,
      c.var.session.user.id,
    );
    return c.json(ret);
  },
);
