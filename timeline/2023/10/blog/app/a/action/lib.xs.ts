import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import z from "zod";

export const withAuth = <Args extends unknown[], R>(
  fn: (userId: string, ...args: Args) => R | Promise<R>,
) => {
  return async (...args: Args) => {
    const session = await auth.api.getSession({ headers: await headers() });
    console.log("session:", session);
    if (!session) throw new Error("NoAuth");
    const userId = session.user.id;
    return await fn(userId, ...args);
  };
};

const _getUser = async (authId: string) => authId;
const getUser = withAuth(_getUser);
const user = await getUser();

const _updateUser = (authId: string, name: string) => {
  console.log(`updating user ${name} with authId ${authId}`);
};
const updateUser = withAuth(_updateUser);

const updateAge = withAuth((authId: string, age: number) => {
  console.log(`updating age ${age} with authId ${authId}`);
});

const withZod1 = <S extends z.ZodType, R>(s: S, fn: (arg: z.output<S>) => R) => {
  return (arg: z.input<S>) => fn(s.parse(arg));
};
// currying
const withZod =
  <S extends z.ZodType>(s: S) =>
  <R>(fn: (arg: z.output<S>) => R) =>
  (arg: z.input<S>) =>
    fn(s.parse(arg));

const userZ = z.object({
  name: z.string(),
  age: z.coerce.number(),
});
const validateUser = withZod(
  z.object({
    name: z.string(),
    age: z.coerce.number(),
  }),
)(async (user) => {
  console.log(`validating user ${user.name} with age ${user.age}`);
});

const u = validateUser({ name: "aa", age: "123" }); // { name: "aa", age: 123 }
const validateUser1 = withZod1(
  z.object({
    name: z.string(),
    age: z.coerce.number(),
  }),
  async (user) => {
    console.log(`validating user ${user.name} with age ${user.age}`);
  },
);

const withZods = <S extends z.ZodTuple, R>(s: S, fn: (...args: z.output<S>) => R) => {
  return (...args: z.input<S>) => fn(...s.parse(args));
};
const validateUser2 = withZods(
  z.tuple([z.string(), z.number()]),
  (name: string, age: number) => {
    console.log(`validating user ${name} with age ${age}`);
  },
);

const ret = z.tuple([z.string(), z.number()]).parse(["aa", 123]); // ["aa", 123]
