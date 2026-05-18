import { newRouter } from "../../app/utils";
import { idOfZ, idZ, searchQuery, slugUnicode, v } from "../../../lib/client/zod";
import { honoAuth, honoSignIn } from "../../auth/middleware";
import { getUser, getUserByName, searchUser, updateUser } from "../service";
import { sendFriendRequest } from "../../../lib/services/user/friend1";
import { userUpdateZ } from "../../../lib/services/user/index.t";
import { friendRequest } from "../../../lib/services/user/friend.t";
import z from "zod";

export const friendApp = newRouter().post(
  "/sendFriendRequest",
  honoSignIn,
  v("json", friendRequest),
  async ({ req, var: { session }, json }) => {
    const authId = session.user.id;
    const data = req.valid("json");
    // return json(null)
    return json(await sendFriendRequest(data, authId));
  },
);
// .get('/by/:username', honoAuth, v('param', z.object({ username: slugUnicode })),
//   async ({ req, var: { session }, json }) => {
//     const { username } = req.valid('param')
//     const authId = session.user.id
//     return json(await getUserByName(username, authId))
//   })
// .get('/:id', honoAuth, v('param', idZ),
//   async ({ req, var: { session }, json }) => {
//     const { id } = req.valid('param')
//     const authId = session.user.id
//     return json(await getUser(id, authId))
//   })
// .patch('', honoSignIn, v('json', userUpdateZ), async ({ req, var: { session }, json, body }) => {
//   const { id } = session.user
//   const data = req.valid('json')
//   await updateUser(id, data)
//   return body(null, 204)
// })
