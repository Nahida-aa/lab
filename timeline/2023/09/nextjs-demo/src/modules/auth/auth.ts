import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db"; // your drizzle instance
import { admin, emailOTP, magicLink, openAPI, organization, phoneNumber, username } from "better-auth/plugins"
import { env } from "@/lib/env";
import { after } from "next/server";

export const auth = betterAuth({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24 * 2, // 1 day (every 2 day the session expiration is updated)
    // https://www.better-auth.com/docs/concepts/session-management#cookie-cache
    // 使用 类似 jwt 的机制将 session 缓存到 cookie 中, 避免一次请求多次查询数据库(可以用react.cache 进行缓存, 但对于非 jsx 渲染的 部分 不适用, 例如 ws 接口)
    cookieCache: {
      enabled: true,
      maxAge: 15 * 60, // Cache duration in seconds (15 minutes)
      strategy: 'jwt', // can be "compact" or "jwt" or "jwe"
      // refreshCache: true, // Enable stateless refresh
      // refreshCache: {
      //   updateAge: 60, // Refresh when 60 seconds remain before expiry
      // },
    },
  },
  account: {
    storeStateStrategy: 'cookie',
    storeAccountCookie: true, // Store account data after OAuth flow in a cookie (useful for database-less flows)
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    username(),
    phoneNumber({
      sendOTP: ({ phoneNumber, code }, ctx) => {
        // Implement sending OTP code via SMS
        console.log("phoneNumber:sendOTP", phoneNumber, code);
        // 模拟发送短信 需要 随机的 等待时间
        const sendPromise = new Promise((resolve, reject) => {
          const item = Math.floor(Math.random() * 10) + 1;
          console.log("item", item);
          setTimeout(() => {
            resolve(0);
          }, 1000 * item);
        });
        after(async () => {
          await sendPromise;
          console.log("after sendOTP");
        });
      },

      signUpOnVerification: {
        getTempEmail: (phoneNumber) => {
          return `${phoneNumber}@tmp.com`
        },
        //optionally, you can also pass `getTempName` function to generate a temporary name for the user
        getTempName: (phoneNumber) => {
          return phoneNumber //by default, it will use the phone number as the name
        }
      }
    }),
    magicLink({
      sendMagicLink: async ({ email, token, url }, ctx) => {
        // send email to user
      }
    }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in") {
          // Send the OTP for sign in
        } else if (type === "email-verification") {
          // Send the OTP for email verification
        } else {
          // Send the OTP for password reset
        }
      },
    }),
    admin(),
    organization(),
    openAPI({
      // path: "/api/auth/docs",
    }), // api/auth/reference
  ],
});

export type AuthUser = typeof auth.$Infer.Session.user & { username: string }
export type AuthSession = {
  user: AuthUser
  session: typeof auth.$Infer.Session.session
  // token: typeof auth.$Infer.Session.token
}