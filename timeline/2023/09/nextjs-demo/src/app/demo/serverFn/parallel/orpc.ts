import { oc } from '@orpc/contract'
import { myFunc } from "./func";
import z from "zod";
import { implement, os } from '@orpc/server'



export const serverFnParallelContract = {
  myFunc: oc.route({ method: 'GET' }).input(z.object({ id: z.number() })).output(z.object({ id: z.number(), time: z.string() }))
}
// const os = implement(serverFnParallelContract) // fully replaces the os from @orpc/server

export const serverFnParallelRouter = {
  myFunc: os.route({ method: 'GET' }).input(z.object({ id: z.string() })).handler(async ({ input }) => {
    console.log("serverFnParallelRouter.myFunc called with input", input.id);
    return myFunc(input.id)
  })
}