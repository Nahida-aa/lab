import { newRouter } from "../../app/utils";
import { withSignIn } from "../../auth/middleware";
import {
  listProjectQuery,
  listUserSelfProjectQuery,
  projectCreateZ,
  projectUpdateZ,
} from "../../../lib/services/project/index.t";
import { slugUnicodeZ, uuidZ, v } from "../../../lib/client/zod";
import {
  createProject,
  getProject,
  listProject,
  listUserProject,
  updateProject,
} from "../service";
import { projectMemberApp } from "./member";

export const projectApp = newRouter()
  .get("user/projects", withSignIn, v("query", listUserSelfProjectQuery), async (c) => {
    const user = c.var.session.user;
    const query = c.req.valid("query");
    const projects = await listUserProject(user.id, query);
    // 直接返回项目数组，匹配 z.array 的响应 schema
    return c.json(projects, 200);
  })
  .get("", v("query", listProjectQuery), async (c) => {
    const query = c.req.valid("query");
    return c.json(await listProject(query), 200);
  })
  .post("", withSignIn, v("json", projectCreateZ), async (c) =>
    c.json(await createProject(c.req.valid("json"), c.var.session.user.id), 201),
  )
  .get("/:slug", v("param", slugUnicodeZ), async (c) =>
    c.json(await getProject(c.req.valid("param").slug)),
  )
  .patch("/:id", withSignIn, v("param", uuidZ), v("json", projectUpdateZ), async (c) => {
    const { id } = c.req.valid("param");
    await updateProject(id, c.req.valid("json"), c.var.session.user.id);
    return c.body(null, 204);
  })
  .route("", projectMemberApp);
