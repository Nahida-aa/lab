import type { RouterClient } from '@orpc/server'
import { RPCLink } from '@orpc/client/fetch'
import { createORPCClient, onError } from '@orpc/client'
import { type contract, router } from '@/modules/app'
import { OpenAPILink } from '@orpc/openapi-client/fetch'
import type { JsonifiedClient } from '@orpc/openapi-client'
import type { ContractRouterClient } from '@orpc/contract'

declare global {
  var $client: RouterClient<typeof router> | undefined
}

const link = new OpenAPILink(router, {
  url: () => {
    if (typeof window === 'undefined') {
      throw new Error('RPCLink is not allowed on the server side.')
    }

    return `${window.location.origin}/api`
  },
  headers: async () => {
    if (typeof window !== 'undefined') {
      return {}
    }

    const { headers } = await import('next/headers')
    return await headers()
  },
})

/**
 * Fallback to client-side client if server-side client is not available.
 */
export const client: RouterClient<typeof router> =
  globalThis.$client ?? createORPCClient(link)
// export const client: JsonifiedClient<ContractRouterClient<typeof contract>> =
//   globalThis.$client ?? createORPCClient(link)
