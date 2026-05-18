import { z } from "zod/v4";

// param
export const idZ = z.object({ id: z.string() });
export const idOfZ = <K extends string>(name: K) =>
  z.object({ [name]: z.string() }) as unknown as z.ZodObject<{ [P in K]: z.ZodString }>;
export const uuidZ = z.object({ id: z.uuid() });

export const uuidZOf = <K extends string>(name: K) =>
  z.object({ [name]: z.uuid() }) as unknown as z.ZodObject<{ [P in K]: z.ZodString }>;

const slugUnicodeReg = /^[\w\p{L}\p{N}-]+$/u;
const SLUG_UNICODE_ERROR_MESSAGE =
  "Slug can only contain letters, numbers, dashes, underscores, and Unicode characters; slug 只能包含字母、数字、-、_和 Unicode 字符";
export const slugUnicode = z.string().regex(slugUnicodeReg, SLUG_UNICODE_ERROR_MESSAGE);
export const slugUnicodeZ = z.object({ slug: slugUnicode });
// query
export const offsetQuery = z.object({
  limit: z.coerce.number().optional().default(20),
  offset: z.coerce.number().optional().default(0),
});
export const searchQuery = z.object({
  q: z.string().optional(),
  ...offsetQuery.shape,
});
export const listIn = z.object({
  id: z.string(),
  q: z.string().optional(),
  limit: z.number().optional().default(20),
  offset: z.number().optional().default(0),
});
export type ListIn = z.input<typeof listIn>;
export type ListOut = z.output<typeof listIn>;
