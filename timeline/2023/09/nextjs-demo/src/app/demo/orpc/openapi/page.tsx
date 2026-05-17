import { getQueryClient } from "@/components/providers/get-query-client"
import { Pre } from "@/components/uix/CodeBlock/pre"
import { orpc } from "@/lib/client/orpc.rq"
import ClientComp from "./client"

export default async function Page() {
    const qc = getQueryClient()
  const data =  await qc.fetchQuery(orpc.findPlanet.queryOptions({ input: { id: 1 }}))
  console.log(data)
  return <main>
    server:
    <Pre json={data} />
    client:
    <ClientComp />
    </main>
}