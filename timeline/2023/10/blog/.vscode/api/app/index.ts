import dbRouter from "../db/router";
// import test from '@/server/routes/test/index'
// import auth from "@/api/auth/router";
// import friend from "@/server/friend/router";
// import follow from '@/server/follow/router'
import notification from "../notification/router";
import { uploadApp } from "../upload/router";
import { channelMessageApp } from "../community/router/msg";
// import users from '@/server/routes/users/route'
// // import users_get from '@/server/routes/users/get'
// import user from '@/server/routes/user/route'
// import groups from '@/server/routes/groups/route'
// import follow from '@/server/routes/follow/route'
// import friend from '@/server/routes/friend/route'
// import chats from '@/server/routes/chats/route'
// import project from '@/server/routes/project/route'

import configOpenAPI from "../openapi/confOpenapi";
import { wsApp } from "../ws/router";
import { newApp } from "./utils";
import { projectApp } from "../project/router";
import { projectVersionApp } from "../project/router/version";
import { communityApp } from "../community/router";
import { channelApp } from "../community/router/channel";
import { userApp } from "../user/router";
import { friendApp } from "../user/router/friend";

const app = newApp();
// ---
// app.route("/project/member", projectMember);
// app.route("/friend", friend);
// .route("/follow", follow)
app.route("/notification", notification);
// .route("/users", users);
// .route("/users/get", users_get);
// .route("/user", user);
// .route("/groups", groups);
// .route("/follow", follow);
// .route("/friend", friend);
// .route("/chats", chats);

// .route("/test", test);

// .route('/openapi', openapi);
app.route("/db", dbRouter);

const routers = app
  .route("", wsApp)
  .basePath("/api")
  .route("/channel", channelMessageApp)
  .route("/channel", channelApp)
  .route("/community", communityApp)
  .route("/project", projectApp)
  .route("/version", projectVersionApp)
  .route("/upload", uploadApp)
  .route("/user", userApp)
  .route("", friendApp);

// configOpenAPI(routers);

// console.log('API app initialized');
// for (const r of app.routes) {
//   console.log(`${r.method} ${r.path}`);
// }

export default routers; // for Cloudflare Workers or Bun

export type AppType = typeof routers;
// export type AppTypes = typeof _app;
