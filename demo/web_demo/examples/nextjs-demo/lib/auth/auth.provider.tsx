"use client";

import { authClient } from "@/lib/auth/client";
import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useEffect,
} from "react";

export type AuthUser = Omit<
  typeof authClient.$Infer.Session.user,
  "username"
> & {
  username: string;
};
export type AuthSession = {
  user: AuthUser;
  session: typeof authClient.$Infer.Session.session;
};

export type AuthContextValue = {
  data: AuthSession | null | undefined;
  status: "loading" | "authenticated" | "unauthenticated";
  update: (data?: any) => Promise<AuthSession | null | undefined>;
};

const AuthContext = createContext<AuthContextValue>({
  data: null,
  status: "loading",
  update: async () => null,
});

export const useAuthSession = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthSession must be used within an AuthSessionProvider",
    );
  }
  return context;
};

type AuthSessionProviderProps = {
  children: ReactNode;
  session?: AuthSession | null;
};

export const AuthSessionProvider = (props: AuthSessionProviderProps) => {
  const { children } = props;

  // 从 authClient 获取最新的会话状态
  const { data: authSession, isPending } = authClient.useSession();

  // 如果没有会话且不在加载中，触发匿名登录
  useEffect(() => {
    if (!authSession && !isPending && !props.session) {
      console.log("触发匿名登录");
      authClient.signIn.anonymous().catch((error) => {
        console.error("匿名登录失败:", error);
      });
    }
  }, [authSession, isPending, props.session]);

  // 优先使用 authClient 的数据，如果还在加载则使用初始 session
  const currentSession = isPending
    ? props.session
    : (authSession as AuthSession);

  const value = useMemo(
    () => ({
      data: currentSession,
      status: (isPending
        ? "loading"
        : currentSession?.user.isAnonymous
          ? "unauthenticated"
          : "authenticated") as "loading" | "authenticated" | "unauthenticated",
      update: async (data?: any) => {
        // update 函数主要用于触发重新渲染
        // authClient.useSession() 会自动处理会话刷新
        return currentSession;
      },
    }),
    [currentSession, isPending],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
