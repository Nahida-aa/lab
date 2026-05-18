type NullContext<Extra> = {} & Extra;
interface BaseContext<I = undefined, O = undefined> {
  input: I;
  output?: O;
}
type DefaultExtra = Record<never, never>;
type AnyFn = (...args: any[]) => any;
type Context<Extra = DefaultExtra> = NullContext<Extra>;

type Mw<Extra, Out extends Record<string, unknown> = Record<string, unknown>> = (
  ctx: Context<Extra>,
) => Out | Promise<Out>;

// function defActN() {
//   // 如果 handler 的参数包含 input 字段，则返回 (input: In) => Promise<R>
//   // 否则返回 () => Promise<R>
//   type HandlerToFn<H> = H extends (c: infer C) => infer R
//     ? C extends { input: infer In }
//       ? (input: In) => R
//       : () => R
//     : () => unknown;

//   interface CreateAct<Extra> {
//     <H extends AnyFn>(handler: H): HandlerToFn<H>;
//     use: (mw: Mw<Extra>) => CreateAct<Extra>;
//   }

//   function createAct<Extra>(): CreateAct<Extra> {
//     // 类型工具(判断H的参数是否有 input)：提取 input if exists
//     type Input<H> = H extends (c: Context<Extra> & { input: infer I }) => any ? I : never;
//     function act<H extends () => any>(handler: H): () => ReturnType<H>;
//     function act<H extends (c: Context<Extra>) => any>(handler: H): () => ReturnType<H>;
//     function act<H extends (c: Context<Extra> & { input: Input<H> }) => any>(
//       handler: H,
//     ): (input: Input<H>) => ReturnType<H>;
//     // 核心函数：条件返回类型 (infer 在条件 extends)
//     function act<H extends AnyFn>(handler: H): ReturnType<H> {
//       return 1 as any;
//     }

//     act.use = (mw) => act;

//     return act;
//   }

//   return createAct();
// }
// tool
type Input<Extra, H> = H extends (c: Context<Extra> & { input: infer I }) => any
  ? I
  : never;
type AwaitRet<T extends AnyFn> = Awaited<ReturnType<T>>;

function createAct<Extra>() {
  type I<H> = Input<Extra, H>;
  // 类型工具(判断H的参数是否有 input)：提取 input if exists
  function act<H extends () => any>(handler: H): () => ReturnType<H>;
  function act<H extends (c: Context<Extra>) => any>(handler: H): () => ReturnType<H>;
  function act<H extends (c: Context<Extra> & { input: I<H> }) => any>(
    handler: H,
  ): (input: I<H>) => ReturnType<H>;
  function act<H extends (...args: any[]) => any>(handler: H) {
    return 1 as any;
  }

  return act;
}
// 有 input：(input: I) => R
// return ((input: any): ReturnType<H> => {
//   const ctx = input !== undefined ? { input } : {};
//   try {
//     return handler(ctx as Parameters<H>[0]);
//   } catch (err) {
//     console.error("Action failed:", err);
//     throw err;
//   }
// }) as any; // 运行时灵活，条件类型覆盖推断
const act0 = createAct<{ id: string }>()((c: { id: string }) => 0); // act0: () => 0
const act1 = createAct()(() => 0); // act1: () => number
const act2 = createAct()((c: { input: number }) => c.input + 1); // act2: (input: number) => number
const act3 = createAct<{ id: string }>()(
  ({ input, id }: { input: number; id: string }) => input + 1,
); // act2: (input: number) => number

// return ((input?: any) => {
//   const ctx = input !== undefined ? { input } : {};
//   const composed = mws.reduce((current: any, mw: any) => mw(current), handler);
//   try {
//     return composed(ctx);
//   } catch (err) {
//     console.error("Action failed:", err);
//     throw err;
//   }
// }) as any;
type Middleware<
  CurrExtra,
  Out extends Record<string, unknown> = Record<string, unknown>,
> = (c: Context<CurrExtra>, next: <Out>(c: Out) => Promise<Out>) => Promise<Out>;
// 这是一个 TypeScript 递归条件类型（recursive conditional type），用于从一个只读数组 Arr（元素为 Middleware<any, any> 类型）中，累积交集（intersect）所有 Middleware 的 OutExtra 类型。它的目的是计算中间件链中所有中间件贡献的上下文扩展（OutExtra）
type CombineMwOutputs<Arr extends readonly unknown[]> = Arr extends [infer H, ...infer R]
  ? H extends Middleware<any, infer Out>
    ? R extends readonly unknown[]
      ? Out & CombineMwOutputs<R>
      : Out
    : CombineMwOutputs<R>
  : Record<string, never>;

function createChain<CurrExtra>(mws: Middleware<CurrExtra>[]) {
  type I<H> = Input<CurrExtra, H>;
  interface CreateAct<CurrExtra> {
    <H extends () => any>(handler: H): () => ReturnType<H>;
    <H extends (c: Context<CurrExtra>) => any>(handler: H): () => ReturnType<H>;
    <H extends (c: Context<CurrExtra> & { input: I<H> }) => any>(
      handler: H,
    ): (input: I<H>) => ReturnType<H>;
    use: <MW extends Middleware<CurrExtra>>(
      mw: MW,
    ) => CreateAct<CurrExtra & CombineMwOutputs<readonly [MW]>>;
  }
  // 先实现 类型
  function act<H extends AnyFn>(handler: H) {
    return 1 as any;
  }
  // 先 实现 类型
  act.use = () => 1 as any;

  return act as CreateAct<CurrExtra>;
}
function defAct<Extra>() {
  return createChain<Extra>([]);
}

const act10 = defAct<{ id: string }>()((c: { id: string }) => 0);
const act11 = defAct()(() => 0); // act11: () => number
const act12 = defAct()((c: { input: number }) => c.input + 1); // act12: (input: number) => number
const act13 = defAct<{ id: string }>()(
  ({ input, id }: { input: number; id: string }) => id + input,
); // act13: (input: number) => string

const act14 = defAct()((c) => c.id); // 类型提示: 参数“c”隐式具有“any”类型
const act15 = defAct().use(async (c, next) => {
  const startTime = performance.now();
  const extraCtx = { id: "example-id" };
  const result = await next(extraCtx);
  const endTime = performance.now();
  console.log("Result ->", result); // 后置：执行后日志
  console.log("Action execution took", endTime - startTime, "ms");
  return result;
})((c) => c.id); // act15: () => string
// 泛型 实验
// function noParam<T>() {
//   return 0 as T;
// }

// noParam();

const af = async () => 1;
const test = async () => {
  const a = await af();
};
