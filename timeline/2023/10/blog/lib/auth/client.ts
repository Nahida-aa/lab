import { createAuthClient } from "better-auth/react";
import {
  adminClient,
  anonymousClient,
  emailOTPClient,
  organizationClient,
  phoneNumberClient,
  twoFactorClient,
  usernameClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  basePath: "/api/auth",

  plugins: [
    twoFactorClient(),
    usernameClient(),
    anonymousClient(),
    phoneNumberClient(),
    emailOTPClient(),
    adminClient(),
    organizationClient(),
  ],
});
export type AuthType = {
  user: typeof authClient.$Infer.Session.user | null;
  session: typeof authClient.$Infer.Session.session | null;
};
// export const {
//   signIn,
//   signOut,
//   signUp,
//   useSession,
//   getSession,

//   twoFactor,

//   updateUser,

//   phoneNumber,
// } = authClient;
