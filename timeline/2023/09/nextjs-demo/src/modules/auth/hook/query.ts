'use client'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { authQ } from './rq'

/**
 * @deprecated use `authQ` instead
 */
export const useSession = () => {
  const { data: session, ...ret } = useQuery(authQ.session)
  return {
    session,
    ...ret,
  }
}
