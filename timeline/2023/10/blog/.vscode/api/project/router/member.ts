// import { newRouter } from "../../app/utils";
// import { uuidZ, uuidZOf, v } from "../../../lib/client/zod";
// import { honoAuth, honoSignIn } from "../../auth/middleware";
// import {
//   inviteJoinProject,
//   listProjectMember,
//   updateProjectMember,
// } from "../service/member";
// import {
//   projectMemberStatus,
//   projectMemberUpdate,
// } from "../../../lib/services/project/member.t";
// import z from "zod";

// export const projectMemberApp = newRouter()
//   .post(
//     "/:id/invite_member",
//     v("param", uuidZ),
//     honoSignIn,
//     v(
//       "json",
//       z.object({
//         entityType: z.enum(["user", "organization"]), // TODO: 之后支持组织
//         entityId: z.string(),
//       }),
//     ),
//     async ({ req, var: { session }, json }) => {
//       const { id: projectId } = req.valid("param");
//       const data = req.valid("json");
//       const userId = session.user.id;
//       const result = await inviteJoinProject(projectId, data.entityId, userId);
//       return json(result, 201);
//     },
//   )
//   .get(
//     "/:id/members",
//     honoAuth,
//     v("param", uuidZ),
//     v("query", z.object({ noStatus: z.enum(projectMemberStatus).array().default([]) })),
//     async (c) => {
//       const { id: projectId } = c.req.valid("param");
//       const { noStatus } = c.req.valid("query");
//       const members = await listProjectMember(projectId, noStatus);
//       return c.json(members);
//     },
//   )
//   .patch(
//     "/member/:id",
//     honoSignIn,
//     v("param", uuidZ),
//     v(
//       "query",
//       z.object({
//         projectId: z.string(),
//       }),
//     ),
//     v("json", projectMemberUpdate),
//     async ({ req, var: { session }, json }) => {
//       const { id } = req.valid("param");
//       const { projectId } = req.valid("query");
//       const data = req.valid("json");
//       const authId = session.user.id;
//       const result = await updateProjectMember(id, data, projectId, authId);
//       return json(result);
//     },
//   );
