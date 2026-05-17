import { getSession } from '@/modules/auth/action'
import { isServer, queryOptions } from '@tanstack/react-query'
import { authClient } from '../client'
import { auth, type AuthSession } from '../auth'


export const authKeys = {
  session: ['session'] as const,
}
export const authQ = {
  session: queryOptions({
    queryKey: authKeys.session,
    queryFn: async () => {
      if (isServer) {
        // const res = await fetch(`${env.NEXT_PUBLIC_APP_URL}/api/auth/get-session`)
        // const data = await res.json()
        // log.dev('authQ.session.isServer', data)
        // return data as AuthSession
        return await getSession()
      }
      const { data, error } = await authClient.getSession()
      if (error) {
        throw error
      }
      return data as AuthSession
    },
    staleTime: 5 * 60 * 1000, // 5 分钟，短 token 15 分钟，所以 5 分钟刷新一次比较安全 default: 0
    gcTime: 10 * 60 * 1000, // 10 分钟缓存, default: 5 minutes
    // retry: false,  // 认证失败不重试（避免无限循环） default: 3
    // refetchOnWindowFocus: true, // 窗口焦点时刷新（用户回来可能 token 过期） default: true
    // refetchOnMount: true, default: true
  }),
  // session: orpc.getSession.queryOptions(),
}
