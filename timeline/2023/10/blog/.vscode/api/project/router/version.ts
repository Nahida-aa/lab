import { newRouter } from "../../app/utils";
import { uuidZOf, uuidZ, v } from "../../../lib/client/zod";
import { withSignIn } from "../../auth/middleware";
import {
  versionCreateWithFilesZ,
  versionUpdateWithOperationsZ,
  versionIdSchema,
} from "../../../lib/services/project/version.t";
import { projectTypeS } from "../../../lib/services/project/index.t";
import {
  createVersion,
  listVersionWithFiles,
  updateVersion,
} from "../../../lib/services/project/version";

export const projectVersionApp = newRouter()
  .post(
    "",
    withSignIn,
    v("query", projectTypeS),
    v("json", versionCreateWithFilesZ),
    async (c) => {
      const authId = c.var.session.user.id;
      const { type } = c.req.valid("query");
      const { versionFiles, ...reqVersion } = c.req.valid("json");
      const result = await createVersion(
        reqVersion.projectId,
        reqVersion,
        versionFiles,
        authId,
        type,
      );
      return c.json(result, 201);
    },
  )
  .patch(
    "/:projectId/:id",
    withSignIn,
    v("param", versionIdSchema),
    v("json", versionUpdateWithOperationsZ),
    async (c) => {
      const authId = c.var.session.user.id;
      const { projectId, id } = c.req.valid("param");
      const { fileOperations, ...versionUpdateData } = c.req.valid("json");
      const result = await updateVersion(
        projectId,
        id,
        versionUpdateData,
        fileOperations,
        authId,
      );
      return c.json(
        {
          message: `版本 ${id} 信息已更新`,
          uploadUrls: result,
        },
        200,
      );
    },
  )
  .get("/:projectId/listWithFiles", v("param", uuidZOf("projectId")), async (c) => {
    const { projectId } = c.req.valid("param");
    const versions = await listVersionWithFiles(projectId);
    return c.json(versions, 200);
  });
