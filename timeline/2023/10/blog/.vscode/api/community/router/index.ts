import { newRouter } from "../../app/utils";
import { idZ, uuidZ, uuidZOf, v } from "../../../lib/client/zod";
import { getCommunityByProjectId } from "../index/service";
import { communityJoinApp } from "./join";

export const communityApp = newRouter()
  .get("/:id", v("param", uuidZ), async ({ req, json }) => {
    const { id } = req.valid("param");
    return json({ id });
  })
  .get("", v("query", uuidZOf("projectId")), async ({ req, json }) => {
    const { projectId } = req.valid("query");
    return json(await getCommunityByProjectId(projectId));
  })
  .route("", communityJoinApp);
