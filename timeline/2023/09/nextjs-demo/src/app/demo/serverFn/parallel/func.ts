'use server'

const wait = (ms: number) => new Promise(res => setTimeout(res, ms))

export async function myFunc(id: string) {
  console.log(`myFunc ${id} start`)
  await wait(2000) // 模拟耗時操作
  return { id, time: new Date().toLocaleTimeString('en-GB', { hour12: false }) }
}

export type myFuncOut = Awaited<ReturnType<typeof myFunc>>
