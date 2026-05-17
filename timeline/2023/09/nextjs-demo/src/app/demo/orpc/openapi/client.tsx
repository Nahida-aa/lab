"use client"

import { Pre } from "@/components/uix/CodeBlock/pre"
import { orpc } from "@/lib/client/orpc.rq"
import { useQuery } from "@tanstack/react-query"

export default function ClientComp (){
   const { data, error, isLoading } = useQuery(orpc.findPlanet.queryOptions({ input: { id: 1 }}))
   if (isLoading) return <p>Loading...</p>
   if (error) return <p>Error: {error.message}</p>
  return <Pre json={data} />
} 