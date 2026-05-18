// src/lib/fp-middleware-dynamic.ts
// import { getSession } from "@/features/auth/action";
// import { analyzeError } from "@/lib/client/utils";
// import { headers } from "next/headers";
import { z, ZodType } from "zod";

type AwaitedRet<T extends (...args: any) => any> = Awaited<ReturnType<T>>;

type CtxBase<TInput = unknown, TOutput = unknown> = {
  input: TInput;
  output?: TOutput;
  error?: Error;
};

type Ctx<TInput = unknown, TOutput = unknown, TExt = {}> = CtxBase<TInput, TOutput> &
  TExt;
type DefaultExtra = Record<never, never>;
// 预处理钩子(中间件)：接收 ctx（ctx.input 已为 Input），返回一个可合并的对象
type Mw<
  Input = unknown,
  CurrExtra = DefaultExtra,
  Out extends Record<string, any> = Record<string, any>,
> = (ctx: Ctx<Input, any, CurrExtra>) => Out | Promise<Out>;

// pre 专用：Omit 'output'（排除无效）
type CombinePreOutputs<Arr extends readonly any[]> = Arr extends [infer H, ...infer R]
  ? H extends Mw<any, any, infer Out>
    ? R extends readonly any[]
      ? Omit<Out, 'output'> & CombinePreOutputs<R>
      : Omit<Out, 'output'>
    : CombinePreOutputs<R>
  : Record<string, never>;
type CombineMwOutputs<Arr extends readonly any[]> = Arr extends [infer H, ...infer R]
  ? H extends Mw<any, any, infer Out>
    ? R extends readonly any[]
      ? Out & CombineMwOutputs<R>
      : Out
    : CombineMwOutputs<R>
  : Record<string, never>;

interface Builder<CurrExtraT = DefaultExtra> {
  act: <H extends (c: Ctx<unknown, unknown, CurrExtraT>) => any>(
    handler: H,
    // ) => (input: Ctx<unknown, any, CurrExtraT>["input"]) => Promise<(CurrExtraT extends { output: infer COutput }
  ) => (
    ...input: CurrExtraT extends { input: infer CInput }
      ? [CInput] 
      : [Parameters<H>[0]["input"]] | []
  ) => Promise<
    CurrExtraT extends { output: infer COutput }
      ? COutput // 若 CurrExtraT 已有 output，则直接返回
      : AwaitedRet<H>
  >;
  // baseAct: 简化的 act，只接收 input
  baseAct: <H extends (input: any) => any>(
    handler: H,
  ) => (
    ...input: CurrExtraT extends { input: infer CInput } ? [CInput] : [Parameters<H>[0]] | []
  ) => Promise<
    CurrExtraT extends { output: infer COutput }
      ? COutput // 若 CurrExtraT 已有 output，则直接返回
      : AwaitedRet<H>
  >;
  pre: <Mws extends readonly Mw<unknown, CurrExtraT, any>[]>(
    ...mws: Mws
  ) => Builder<CurrExtraT & (CombinePreOutputs<Mws>)>; // (Omit<CombineMwOutputs<Mws>, 'output'>)
  after: <Mws extends readonly Mw<unknown, CurrExtraT, any>[]>(
    ...mws: Mws
  ) => Builder<CurrExtraT & CombineMwOutputs<Mws>>;
  onError: <Mws extends readonly Mw<unknown, CurrExtraT & { error: Error }, any>[]>(
    ...mws: Mws
  ) => Builder<CurrExtraT & CombineMwOutputs<Mws>>
}
const def = () => {
  const preMws: Mw[] = [];
  const afterMws: Mw[] = [];
  const errorMws: Mw[] = [];

  const createBuilder = <CurrExtraT = DefaultExtra>(): Builder<CurrExtraT> => ({
    act: (handler: any) => async (...input: any[]) => {
      console.log(input);
      // 运行时：执行 handler，返回其 output
      let ctx = { input: input[0] } as any;
      try {
        // 依次跑 mws，merge Out 到 ctx（immutable）
        for (const preMw of preMws) {
          const mwOut = await preMw(ctx);
          ctx = { ...ctx, ...mwOut }; // merge（覆盖 input/output 等）
          if (ctx.error) break; // 早停
        }
        ctx.output = handler(ctx);
        // 依次跑 afterMws，merge Out 到 ctx（immutable）
        for (const afterMw of afterMws) {
          const mwOut = await afterMw(ctx);
          ctx = { ...ctx, ...mwOut }; // merge（覆盖 input/output 等）
          if (ctx.error) break; // 早停
        }
        return ctx.output;
      } catch (e) {
        ctx = { ...ctx, error: e };
        for (const mw of errorMws) {
          const mwOut = await mw(ctx);
          ctx = { ...ctx, ...mwOut };
          if (ctx.output) break; // recovery：有 output 则停，return fallback
        }
        // 决定：recovery (ctx.output) 或 rethrow
        if (ctx.output) return ctx.output;
        throw ctx.error ?? e;
      }
    },
    baseAct: (handler: any) => async (...input: any[]) => {
      console.log(input);
      // 运行时：执行 handler，返回其 output
      let ctx = { input: input[0] } as any;
      try {
        // 依次跑 mws，merge Out 到 ctx（immutable）
        for (const preMw of preMws) {
          const mwOut = await preMw(ctx);
          ctx = { ...ctx, ...mwOut }; // merge（覆盖 input/output 等）
          if (ctx.error) break; // 早停
        }
        ctx.output = handler(ctx.input);
        // 依次跑 afterMws，merge Out 到 ctx（immutable）
        for (const afterMw of afterMws) {
          const mwOut = await afterMw(ctx);
          ctx = { ...ctx, ...mwOut }; // merge（覆盖 input/output 等）
          if (ctx.error) break; // 早停
        }
        return ctx.output;
      } catch (e) {
        ctx = { ...ctx, error: e };
        for (const mw of errorMws) {
          const mwOut = await mw(ctx);
          ctx = { ...ctx, ...mwOut };
          if (ctx.output) break; // recovery：有 output 则停，return fallback
        }
        // 决定：recovery (ctx.output) 或 rethrow
        if (ctx.output) return ctx.output;
        throw ctx.error ?? e;
      }
    },
    pre: (...newMws: any[]) => {
      preMws.push(...newMws);
      return createBuilder();
    },
    after: (...newMws: any[]) => {
      afterMws.push(...newMws);
      return createBuilder();
    },
    onError: (...newMws: any[]) => {
      errorMws.push(...newMws);
      return createBuilder();
    },
  });

  return createBuilder();
};

const act1 = def();
const demo0 = act1.act((c: { input: number }) => {
  console.log(c);
  return "hello";
});
demo0(0).then((res) => console.log(res)); // hello
const demo01 = act1.baseAct((input: number) => {
  console.log(input);
  return "hello";
});
demo01(0).then((res) => console.log(res)); // hello

const demo1 = def().act((c) => {
  console.log(c);
  return { output: "hello" };
});
console.log(demo1());
const demo11 = def().act((c) => {
  console.log(c);
  return { output: "hello" };
});
console.log(demo11());
console.log('demo12:')
const demo12 = def().baseAct((i) => {
  console.log(i);
  return { output: "hello" };
});
demo12().then((res) => console.log(res)); // hello

const demo2 = def()
  .pre((c) => ({ userId: "user1", output: 1 }))
  .act((c) => {
    console.log(c);
    c.userId;
    return "hello";
  }); // (number) -> string
console.log(demo2());

// 修改输入
const demo3 = def()
  .pre((c) => {
    // throw new Error("auth failed");
    return { userId: "user1", input: 1 };
  })
  .act((c) => {
    console.log(c);
    c.userId;
    return { ret: "hello" };
  }); // (number) -> { ret: "hello" }
console.log(demo3(0));
const demo31 = def()
  .pre((c) => {
    // throw new Error("auth failed");
    return { userId: "user1", input: 1, output: "s" };
  })
  .act((c) => {
    console.log(c)
    c.input;
    c.userId;
    return { ret: "hello" };
  }); // (number) -> { ret: "hello" }

// zod 验证
const zv =
  <Schema extends ZodType<any>>(schema: Schema) =>
  async (ctx: Ctx) => {
    return { input: schema.parse(ctx.input) };
  };
const schema = z.object({
  name: z.string().min(3),
  age: z.number().positive(),
});
const demo4 = def()
  .pre(zv(schema))
  .after((c) => ({ output: "s" }))
  .act((c) => {
    c.input
    return 2;
  });
// console.log("demo4"); // 2
// demo4({ name: "abc", age: 123 }).then((res) => console.log(res)); // 2
const demo41 = def()
  .pre(zv(schema))
  .after((c) => ({ output: "s" }))
  .baseAct((i) => {
    return 2;
  });

const act = def().onError(({ error }) => {
  console.log("onError:");
  console.log(error);
  // const analyzedError = analyzeError(error);
  console.log("analyzedError:");
  // console.log(analyzedError);
  // return { error: new Error(analyzedError.message, { cause: analyzedError.cause })}
  if (error.message === 'act错误') {
    console.log('捕获到自定义错误')
  }
  return { error: new Error('自定义错误')}
}).act((c) => {
  throw new Error("act错误")
  return 2
})
act().then((res) => console.log(res)) // 2
const act2 = def().onError(({ error }) => {
  console.log("onError:");
  console.log(error);
  // const analyzedError = analyzeError(error);
  console.log("analyzedError:");
  // console.log(analyzedError);
  // return { error: new Error(analyzedError.message, { cause: analyzedError.cause })}
  // if (error.message !== 'act错误') return
  if (error.message === 'act错误') {
    console.log('捕获到自定义错误')
    throw new Error('自定义错误')
  }
  throw error
});
const f2 = act2.act((c) => {
  // throw new Error("act错误")
  return 2
})
// act2(1).then((res) => console.log(res)) // 2

export const actWithZod = (schema: ZodType<any>) => def().pre(zv(schema));

// const preAuth = async (c: Ctx) => {
//   const session = await getSession(await headers());
//   if (!session) throw new Error("未登录");
//   return { userId: session.user.id };
// };
// export const actWithAuth = def().pre(preAuth);
// export const actWithZodAndAuth = actWithZod(schema).pre(preAuth);

// const app = def().pre((c) => {
//   const schema = z.object({
//     name: z.string().min(3),
//     age: z.number().positive(),
//   });
//   return { input: schema.parse(c.input) };  // 输入类型为 z.infer<Schema>
// })
// const demo5 = app.onError(({error})=>{
//   console.log(error);
// }).act((c) => {
//   return 2
// })
// console.log(demo5({ name: "ab", age: 123 })); // 2

// 1. 验证钩子：return 窄 input 类型
// const validate = <Schema extends ZodType<any>>(schema: Schema): PreHook<z.infer<Schema>, any> =>
//   async (ctx: ExtendCtx<z.infer<Schema>, any>): Promise<ExtendCtx<z.infer<Schema>, any>> => {
//     try {
//       const validated = schema.parse(ctx.input);
//       return { ...ctx, input: validated };  // return 新 ctx，类型窄化
//     } catch (e) {
//       return { ...ctx, error: e as Error };  // 设 error 停链
//     }
//   };

// // 2. auth 预处理钩子：return 扩展 { userId: string }（动态根据 token）
// const authHook = (): PreHook<any, any, {}, { userId: string }> =>
//   async (ctx: ExtendCtx<any, any>): Promise<ExtendCtx<any, any, { userId: string }>> => {
//     const token = ctx.input?.token;
//     const userId = token ? `user_${token}` : 'anonymous';
//     return { ...ctx, userId };  // return 扩展，类型 & { userId: string }
//   };

// // 3. 输出修改钩子：return 包装 output
// const transformOutput = <TOutput>(transformer: (output: TOutput) => TOutput): PreHook<any, TOutput> =>
//   async (ctx: ExtendCtx<any, TOutput>): Promise<ExtendCtx<any, TOutput>> => {
//     if (ctx.error) return ctx;
//     const output = ctx.output as TOutput;
//     return { ...ctx, output: transformer(output) };
//   };

// // 导出
// export { def, validate, authHook, transformOutput };
// // src/features/auth/services/authApi.ts
// // import { z } from 'zod';
// // import { createAct, validate, authMiddleware, transformOutput } from '@/lib/fp-middleware-v3';

// // Zod schema：驱动 data 类型
// const loginSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(8),
// });

// // 零参启动
// const loginUser = def()
//   .use(validate(loginSchema)) // CurrentInput.data → { email: string; password: string }
//   // .use(authHook()) // CurrentInput.ctx → { userId: string; timestamp: number }
//   // .use(transformOutput((result: string) => `success: ${result}`))
//   .act(async (c) => {
//     // TS 补全：input.data.email / input.ctx.userId（可选链 input.ctx?.userId）
//     console.log(`Logging in for user ${input.ctx.userId} at ${input.ctx.timestamp}`);
//     // 模拟业务
//     return `logged in ${input.data.email}`;
//   });

// // def：fn 无需注解，TS 自动 { data: { email, password }, ctx: { userId, timestamp } }

// // 测试：调用
// await loginUser({
//   data: { email: "test@example.com", password: "secure123", token: "jwt123" },
// }).then((res) => console.log(res)); // "success: logged in test@example.com"

// // 验证失败：早抛，链停（不跑 authMw/fn）
// try {
//   await loginUser({ data: { email: "invalid", password: "short" } });
// } catch (e: any) {
//   if (e instanceof ZodError) {
//     console.error(e.errors[0].message); // "Invalid email"，不泄露 ctx
//   }
// }

// // 类型安全：TS 报错如果 fn 用错（e.g., input.foo → Property 'foo' does not exist）
