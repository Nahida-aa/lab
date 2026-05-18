import { auth } from "@/lib/auth";
import { act } from "@/lib/safe-action";
import { createMiddleware } from "next-safe-action";
import { cookies, headers } from "next/headers";
import { z, type ZodType } from "zod";

interface BaseContext<TInput = undefined, TOutput = undefined> {
  input: TInput;
  output?: TOutput;
}
// Default: no extra fields are present unless injected by pre middlewares
// No extra fields by default
type DefaultExtra = Record<never, never>;
type Context<
  TInput = undefined,
  TOutput = undefined,
  TExtra = DefaultExtra,
> = BaseContext<TInput, TOutput> & TExtra;

export function defAct<S extends z.ZodTypeAny = z.ZodVoid, TExtra = DefaultExtra>(
  schema?: S,
): ReturnType<typeof createFactoryWithSchema<S, TExtra>>;

export function defAct(schema?: ZodType) {
  // runtime: schema may be schema or undefined
  if (schema) return createFactoryWithSchema(schema);
  return createFactoryWithSchema(z.void());
}

// 预处理钩子(中间件)：接收 ctx（ctx.input 已为 Input），返回一个可合并的对象
type PreMw<
  Input,
  CurrExtra,
  Out extends Record<string, unknown> = Record<string, unknown>,
> = (ctx: Context<Input, unknown, CurrExtra>) => Out | Promise<Out>;

type CombinePreMwOutputs<Arr extends readonly unknown[]> = Arr extends [
  infer H,
  ...infer R,
]
  ? H extends PreMw<any, any, infer Out>
    ? R extends readonly unknown[]
      ? Out & CombinePreMwOutputs<R>
      : Out
    : CombinePreMwOutputs<R>
  : Record<string, never>;

type ExtraMismatch<H, CurrExtra> = H extends (c: infer P) => any
  ? [P] extends [any]
    ? never
    : Exclude<keyof P, keyof CurrExtra>
  : never;

function createFactoryWithSchema<S extends z.ZodTypeAny, TExtra = DefaultExtra>(
  schema: S,
) {
  type Input = z.infer<S>;

  interface Factory<CurrExtra> {
    <H extends (c: Context<Input, any, CurrExtra>) => any>(
      handler: H,
    ): (input: z.input<S>) => ReturnType<H>;
    pre: <Mws extends readonly PreMw<Input, CurrExtra, any>[]>(
      ...mws: Mws
    ) => Factory<CurrExtra & CombinePreMwOutputs<Mws>>;
  }

  function createFactory<CurrExtra = TExtra>(
    pres: readonly PreMw<Input, CurrExtra, any>[] = [],
  ): Factory<CurrExtra> {
    const factory = <H extends (c: Context<Input, any, CurrExtra>) => any>(
      handler: H,
    ) => {
      return async (input: z.input<S>): Promise<Awaited<ReturnType<H>>> => {
        const parsedInput = schema.parse(input);
        const ctx = { input: parsedInput } as Context<
          Input,
          any,
          CurrExtra & Record<string, any>
        >;

        for (const mw of pres) {
          const out = await mw(ctx as any);
          if (out && typeof out === "object") Object.assign(ctx, out);
          else throw new Error("Pre must return an object");
        }

        try {
          return (await handler(ctx)) as Awaited<ReturnType<H>>;
        } catch (err) {
          console.error("Action failed:", err);
          throw err;
        }
      };
    };

    (factory as any).pre = <Mws extends readonly PreMw<Input, CurrExtra, any>[]>(
      ...mws: Mws
    ) => {
      return createFactory<CurrExtra & CombinePreMwOutputs<Mws>>([...pres, ...mws]);
    };

    return factory as unknown as Factory<CurrExtra>;
  }

  return createFactory();
}
type Input<Extra, H> = H extends (c: Context<Extra> & { input: infer I }) => any
  ? I
  : never;
function createFactoryNoSchema<TInput = undefined, TExtra = DefaultExtra>() {
  // 如果 handler 的参数包含 input 字段，则返回 (input: In) => Promise<R>
  // 否则返回 () => Promise<R>
  type HandlerToFn<H> = H extends (c: infer P) => infer R
    ? P extends { input: infer In }
      ? (input: In) => R
      : () => R
    : () => unknown;

  interface Factory<CurrExtra> {
    <H>(handler: H): HandlerToFn<H>;
    <H extends () => any>(handler: H): () => ReturnType<H>;
    <H extends (c: Context<CurrExtra>) => any>(handler: H): () => ReturnType<H>;
    <H extends (c: Context<CurrExtra> & { input: Input<CurrExtra, H> }) => any>(
      handler: H,
    ): (input: Input<CurrExtra, H>) => ReturnType<H>;

    pre: <Mws extends readonly PreMw<TInput, CurrExtra, any>[]>(
      ...mws: Mws
    ) => Factory<CurrExtra & CombinePreMwOutputs<Mws>>;
  }

  function createFactory<CurrExtra = TExtra>(
    pres: readonly PreMw<TInput, CurrExtra, any>[] = [],
  ): Factory<CurrExtra> {
    const factory = <H extends (c: any) => any>(handler: H) => {
      return async (input: any): Promise<any> => {
        const parsedInput = input as TInput;

        const ctx = { input: parsedInput } as Context<
          TInput,
          any,
          CurrExtra & Record<string, any>
        >;

        for (const mw of pres) {
          const out = await mw(ctx as any);
          if (out && typeof out === "object") Object.assign(ctx, out);
          else throw new Error("Pre must return an object");
        }

        try {
          return await handler(ctx);
        } catch (err) {
          console.error("Action failed:", err);
          throw err;
        }
      };
    };

    factory.pre = <Mws extends readonly PreMw<TInput, CurrExtra, any>[]>(...mws: Mws) => {
      return createFactory<CurrExtra & CombinePreMwOutputs<Mws>>([...pres, ...mws]);
    };

    return factory as Factory<CurrExtra>;
  }

  return createFactory();
}

export const defPreMw = <T>(preMw: T) => preMw;

// generic usage
const demoZ = z.object({ a: z.coerce.number(), b: z.number() });

const demo = defAct(demoZ)(async (c) => c.input.a + c.input.b);
// (input: { a: unknown; b: number }) => Promise<number>
// c.input is inferred as { a: number; b: number }

// no schema
const demo1 = defAct()(() => 1); // () => Promise<number>
const _demo = async (c: { input: { a: number; b: number } }) => c.input.a + c.input.b;
const demo2 = defAct()(_demo); // (input: { a: number; b: number }) => Promise<number>
const demo3 = defAct().pre((c) => {})((c: { id: string }) => {
  c.id;
}); // () => Promise<string>
const demo4 = defAct().pre((c) => {
  return { id: "mw-id" };
})((c) => c.id); // () => Promise<string>
const demo41 = defAct(z.void()).pre(async (c) => {
  console.log("ctx in mw:", c);
  return { id: "mw-id" };
})(async (c) => {
  console.log("handler sees id ", c.id);
  return c.input;
});

// pre handler middleware
const demo5 = defAct(demoZ).pre(async (c) => {
  console.log("ctx in mw:", c);
  return { id: "mw-id" };
})(async (c) => {
  console.log("handler sees id ", c.id);
  return c.input.a + c.input.b;
});
// (input: { a: unknown; b: number }) => Promise<number>
// c.input is inferred as { a: number; b: number }, c.id is inferred as string

// custom pre handler middleware
export const injectCookie = defPreMw(() => ({ cookies }));
export const injectHeaders = defPreMw(() => ({ headers }));
export const authMw = defPreMw(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  console.log("session:", session);
  if (!session) throw new Error("NoAuth");
  return { authId: session.user.id };
});
const demo6 = defAct().pre(authMw)(_demo);

// 泛型教学
// 函数的 泛型 源自参数或显式声明
function wrap<T>(value: T): T[] {
  return [value];
}
const result = wrap(123); // T 被推断为 number, 鼠标悬停 wrap 变量时，会显示 T 变成了 number

// void 类型
function f(this: void) {
  console.log("this:", this);
}
f();
