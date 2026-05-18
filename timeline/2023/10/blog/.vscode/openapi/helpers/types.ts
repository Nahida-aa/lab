import type { z } from "zod";
// https://github.com/w3cj/stoker/blob/main/src/openapi/helpers/types.ts

// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
export type ZodSchema = z.ZodUnion | z.AnyZodObject | z.ZodArray<z.AnyZodObject>;
export type ZodIssue = z.ZodIssue;
