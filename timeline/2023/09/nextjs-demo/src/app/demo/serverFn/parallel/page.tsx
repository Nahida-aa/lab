import { Suspense } from 'react'
import Action, {
  FuncMode1,
  FuncMode2,
  FuncMode3,
  ParallelTestItem,
  RqOrpc,
  RqOrpcSuspense,
  RqOrpcSuspenses,
  RqParallelOrpc,
  RqServerFn,
  UseServerData,
} from './Action'
import { myFunc } from './func'

export default function Page() {
  const serverStart = new Date().toLocaleTimeString('en-GB', { hour12: false })
  console.log('server start', serverStart)
  return (
    <main className="flex flex-col gap-1">
      <Suspense
        fallback={
          <ParallelTestItem
            code={`export function UseServerData({
  data1,
  data2,
}: {
  data1: Promise<myFuncOut>
  data2: Promise<myFuncOut>
}) {
  const clientData1 = use(data1)
  const clientData2 = use(data2)
  // ...
}
// server component
<UseServerData data1={myFunc(1)} data2={myFunc(2)} />`}
            title="useServerData"
          />
        }
      >
        <UseServerData
          data1={myFunc('useServerData1')}
          data2={myFunc('useServerData2')}
        />
      </Suspense>
      <Suspense
        fallback={
          <ParallelTestItem
            code={`const query1 = useSuspenseQuery(orpc.myFunc.queryOptions({ input: 3 }))
const query2 = useSuspenseQuery(orpc.myFunc.queryOptions({ input: 4 }))
// 预期结果: 在 Network 面板中，不容易观察, 因为查询在服务端
// 结果是在服务端串行, 因为 useSuspenseQuery 需要等待 前一个 suspense
// 即 await suspense 完成后才会进行下一个 suspense`}
            title="rq.suspense_orpc"
          />
        }
      >
        <RqOrpcSuspense />
      </Suspense>
      <Suspense
        fallback={
          <ParallelTestItem
            code={`const [query1, query2] = useSuspenseQueries({
  queries: [
    orpc.myFunc.queryOptions({ input: 5 }),
    orpc.myFunc.queryOptions({ input: 6 }),
  ],
})
// 预期结果: 在 Network 面板中，不容易观察`}
            title="rq.suspense.parallel_orpc"
          />
        }
      >
        <RqOrpcSuspenses />
      </Suspense>

      <RqOrpc />
      <RqParallelOrpc />
      {/* <RqServerFn /> */}

      <FuncMode3 />
      <FuncMode2 />
      <FuncMode1 />
      <Action />
    </main>
  )
}
