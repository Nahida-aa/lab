import { newRouter } from "../../app/utils";
import { idZ, searchQuery, slugUnicode, v } from "../../../lib/client/zod";
import { honoAuth, honoSignIn } from "../../auth/middleware";
import { friendApp } from "./friend";
import { getUser, getUserByName, searchUser, updateUser } from "../service";
import { userUpdateZ } from "../../../lib/services/user/index.t";
import z from "zod";

export const userApp = newRouter()
  .get("/search", v("query", searchQuery), async ({ req, json }) => {
    const { q, limit, offset } = req.valid("query");
    if (!q) return json([]);
    return json(await searchUser(q));
  })
  .get(
    "/by/:username",
    honoAuth,
    v("param", z.object({ username: slugUnicode })),
    async ({ req, var: { session }, json }) => {
      const { username } = req.valid("param");
      const authId = session.user.id;
      return json(await getUserByName(username, authId));
    },
  )
  .get("/:id", honoAuth, v("param", idZ), async ({ req, var: { session }, json }) => {
    const { id } = req.valid("param");
    const authId = session.user.id;
    return json(await getUser(id, authId));
  })
  .patch(
    "",
    honoSignIn,
    v("json", userUpdateZ),
    async ({ req, var: { session }, json, body }) => {
      const { id } = session.user;
      const data = req.valid("json");
      await updateUser(id, data);
      return body(null, 204);
    },
  );
