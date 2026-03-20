'use client'

import React, { use, useRef, useTransition } from 'react'
import { myFunc, type myFuncOut } from './func'
import { Button } from '@/components/uix/button'
import {
  useQueries,
  useQuery,
  useSuspenseQueries,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { orpc } from '@/lib/client/orpc.rq'
import { useReset } from '@/hooks/useReset'
import { Pre } from '@/components/uix/CodeBlock/pre'
import { CodeBlock } from '@/components/uix/CodeBlock/client'

export default function Action() {
  const [isPending, startTransition] = useTransition()
  const [value, setValue] = React.useState<[string, string]>(['', ''])
  const handleClick = () => {
    // 快速點擊兩次
    startTransition(() => {
      myFunc('1').then(res => {
        setValue([res.time, value[1]])
      })
    })
    startTransition(() => {
      myFunc('2').then(res => {
        setValue([value[0], res.time])
      })
    })
  }
  // 預期結果：在 Network 面板中，你會看到第一個請求（POST）開始執行，直到 2 秒後結束，第二個請求才會發出

  return (
    <Button pending={isPending} onClick={handleClick}>
      action time: {value[0]} | {value[1]}
    </Button>
  )
}

export function FuncMode1() {
  const [value, setValue] = React.useState<[string, string]>(['', ''])
  const handleClick = () => {
    myFunc('1').then(res => {
      setValue([res.time, value[1]])
    })
    myFunc('2').then(res => {
      setValue([value[0], res.time])
    })
  }
  // 預期結果：在 Network 面板中，你會看到第一個請求（POST）開始執行，直到 2 秒後結束，第二個請求才會發出

  return (
    <Button onClick={handleClick}>
      server function time: {value[0]} | {value[1]}
    </Button>
  )
}
export function FuncMode2() {
  const [value, setValue] = React.useState<[string, string]>(['', ''])
  const handleClick = async () => {
    const data1 = await myFunc('1')
    const data2 = await myFunc('2')
    setValue([data1.time, data2.time])
  }

  // 預期結果：在 Network 面板中，你會看到第一個請求（POST）開始執行，直到 2 秒後結束，第二個請求才會發出

  return (
    <Button onClick={handleClick}>
      server function (await) time: {value[0]} | {value[1]}
    </Button>
  )
}

export function FuncMode3() {
  const [value, setValue] = React.useState<[string, string]>(['', ''])
  const handleClick = async () => {
    const [data1, data2] = await Promise.all([myFunc('1'), myFunc('2')])
    setValue([data1.time, data2.time])
  }

  // 預期結果：在 Network 面板中，你會看到第一個請求（POST）開始執行，直到 2 秒後結束，第二個請求才會發出

  return (
    <Button onClick={handleClick}>
      server function (Promise.all) time: {value[0]} | {value[1]}
    </Button>
  )
}

export function UseServerData({
  data1,
  data2,
}: {
  data1: Promise<myFuncOut>
  data2: Promise<myFuncOut>
}) {
  const clientData1 = use(data1)
  const clientData2 = use(data2)
  const title = 'useServerData'
  const code = `export function UseServerData({
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
<UseServerData data1={myFunc(\`${title}1
\`)} data2={myFunc(\`${title}2\`)} />`
  return (
    <ParallelTestItem
      code={code}
      title={title}
      time1={clientData1?.time}
      time2={clientData2?.time}
    />
  )
}

export function RqServerFn() {
  const title = 'rq+nextjs.server.func'
  const query1 = useQuery({
    queryKey: ['myFunc', `${title}1`],
    queryFn: () => myFunc(`${title}1`),
  })
  const query2 = useQuery({
    queryKey: ['myFunc', `${title}2`],
    queryFn: () => myFunc(`${title}2`),
  })
  // 在 Network 面板中，你会看到 2 个 path=当前path 的 post 在串行
  const handleClick = async () => {
    query1.refetch()
    query2.refetch()
  }
  const code = `const query1 = useQuery({
  queryKey: ['myFunc', \`${title}1\`],
  queryFn: () => myFunc(\`${title}1\`),
})
const query2 = useQuery({
  queryKey: ['myFunc', \`${title}2\`],
  queryFn: () => myFunc(\`${title}2\`),
})
// 在 Network 面板中，你会看到 2 个 path=当前path 的 post 在串行
`
  return (
    <ParallelTestItem
      code={code}
      handleClick={handleClick}
      title={title}
      time1={query1.data?.time}
      time2={query2.data?.time}
      isLoading1={query1.isLoading}
      isLoading2={query2.isLoading}
      isFetching1={query1.isFetching}
      isFetching2={query2.isFetching}
    />
  )
}

export function RqOrpc() {
  const title = 'rq_orpc'
  const query1 = useQuery(orpc.myFunc.queryOptions({ input: { id: `${title}1` } }))
  const query2 = useQuery(orpc.myFunc.queryOptions({ input: { id: `${title}2` } }))
  // 预期结果: 在 Network 面板中，你會看到 两个请求 是几乎同时发出的
  const handleClick = async () => {
    query1.refetch()
    query2.refetch()
  }
  const code = `const query1 = useQuery(orpc.myFunc.queryOptions({ input: { id: \`${title}1\` } }))
const query2 = useQuery(orpc.myFunc.queryOptions({ input: { id: \`${title}2\` } }))
// 预期结果: 在 Network 面板中，你會看到 两个请求 是几乎同时发出的
`
  return (
    <ParallelTestItem
      code={code}
      handleClick={handleClick}
      title={title}
      time1={query1.data?.time}
      time2={query2.data?.time}
      isLoading1={query1.isLoading}
      isLoading2={query2.isLoading}
      isFetching1={query1.isFetching}
      isFetching2={query2.isFetching}
    />
  )
}
export function RqParallelOrpc() {
  const title = 'rq.parallel_orpc'
  const [query1, query2] = useQueries({
    queries: [
      orpc.myFunc.queryOptions({ input: { id: `${title}1` } }),
      orpc.myFunc.queryOptions({ input: { id: `${title}2` } }),
    ],
  })
  // 预期结果: 在 Network 面板中，你會看到 两个请求 是几乎同时发出的
  const handleClick = async () => {
    query1.refetch()
    query2.refetch()
  }
  const code = `const [query1, query2] = useQueries({
  queries: [
    orpc.myFunc.queryOptions({ input: { id: \`${title}1\` } }),
    orpc.myFunc.queryOptions({ input: { id: \`${title}2\` } }),
  ],
})
// 预期结果: 在 Network 面板中，你會看到 两个请求 是几乎同时发出的`
  return (
    <ParallelTestItem
      code={code}
      handleClick={handleClick}
      title={title}
      time1={query1.data?.time}
      time2={query2.data?.time}
      isLoading1={query1.isLoading}
      isLoading2={query2.isLoading}
      isFetching1={query1.isFetching}
      isFetching2={query2.isFetching}
    />
  )
}

export function RqOrpcSuspense() {
  const title = 'rq.suspense_orpc'
  const query1 = useSuspenseQuery(
    orpc.myFunc.queryOptions({ input: { id: `${title}1` } }),
  )
  const query2 = useSuspenseQuery(
    orpc.myFunc.queryOptions({ input: { id: `${title}2` } }),
  )
  // 预期结果: 在 Network 面板中，不容易观察, 因为查询在服务端
  // 结果是在服务端串行, 因为 useSuspenseQuery 需要等待 前一个 suspense
  // 即 await suspense 完成后才会进行下一个 suspense
  const handleClick = async () => {
    query1.refetch()
    query2.refetch()
  }
  const code = `const query1 = useSuspenseQuery(orpc.myFunc.queryOptions({ input: \`${title}1\` }))
const query2 = useSuspenseQuery(orpc.myFunc.queryOptions({ input: \`${title}2\` }))
// 预期结果: 在 Network 面板中，不容易观察, 因为查询在服务端
// 结果是在服务端串行, 因为 useSuspenseQuery 需要等待 前一个 suspense
// 即 await suspense 完成后才会进行下一个 suspense
`
  return (
    <ParallelTestItem
      title={title}
      code={code}
      handleClick={handleClick}
      time1={query1.data?.time}
      time2={query2.data?.time}
      isLoading1={query1.isLoading}
      isLoading2={query2.isLoading}
      isFetching1={query1.isFetching}
      isFetching2={query2.isFetching}
    />
  )
}
export function RqOrpcSuspenses() {
  const title = 'rq.suspense.parallel_orpc'
  const [query1, query2] = useSuspenseQueries({
    queries: [
      orpc.myFunc.queryOptions({ input: { id: `${title}1` } }),
      orpc.myFunc.queryOptions({ input: { id: `${title}2` } }),
    ],
  })
  // 预期结果: 在 Network 面板中，不容易观察,
  const handleClick = async () => {
    query1.refetch()
    query2.refetch()
  }
  const code = `const [query1, query2] = useSuspenseQueries({
  queries: [
    orpc.myFunc.queryOptions({ input: { id: \`${title}1\` } }),
    orpc.myFunc.queryOptions({ input: { id: \`${title}2\` } }),
  ],
})
// 预期结果: 在 Network 面板中，不容易观察`

  return (
    <ParallelTestItem
      code={code}
      handleClick={handleClick}
      title={title}
      time1={query1.data?.time}
      time2={query2.data?.time}
      isLoading1={query1.isLoading}
      isLoading2={query2.isLoading}
      isFetching1={query1.isFetching}
      isFetching2={query2.isFetching}
    />
  )
}
export const ParallelTestItem = ({
  code = '',
  handleClick,
  title,
  time1,
  time2,
  isLoading1,
  isLoading2,
  isFetching1,
  isFetching2,
}: {
  code?: string
  handleClick?: () => void | Promise<void>
  title: string
  time1?: string
  time2?: string
  isLoading1?: boolean
  isLoading2?: boolean
  isFetching1?: boolean
  isFetching2?: boolean
}) => {
  const startTime = useRef(new Date().toLocaleTimeString('en-GB', { hour12: false }))

  return (
    <div className="flex gap-1">
      <CodeBlock code={code} language="tsx" />

      <Button
        onClick={() => {
          startTime.current = new Date().toLocaleTimeString('en-GB', { hour12: false })
          handleClick?.()
        }}
        pending={isLoading1 || isLoading2 || isFetching1 || isFetching2}
        className="flex-col h-fit py-2"
      >
        {title}
        <div>client start: {startTime.current}</div>
        <div>time1: {time1}</div>
        <div>time2: {time2}</div>
      </Button>
      {/* <Pre
        json={{
          query1: {
            isLoading: isLoading1,
            isFetching: isFetching1,
          },
          query2: {
            isLoading: isLoading2,
            isFetching: isFetching2,
          },
        }}
      /> */}
    </div>
  )
}
