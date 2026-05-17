import { ORPCError, os } from "@orpc/server";
import { oc } from '@orpc/contract'
import * as z from "zod";
import { serverFnParallelContract, serverFnParallelRouter } from "@/app/demo/serverFn/parallel/orpc";

const PlanetSchema = z.object({
  id: z.number().int().min(1),
  name: z.string(),
  description: z.string().optional(),
});

export const listPlanet = os
  .route({ method: "GET" })
  .input(
    z.object({
      limit: z.number().int().min(1).max(100).optional(),
      cursor: z.number().int().min(0).default(0),
    }),
  )
  .output(z.array(PlanetSchema))
  .handler(async ({ input }) => {
    // your list code here
    return [{ id: 1, name: "name" }];
  });

export const findPlanetCoerce = os
  .route({ method: "GET" })
  .input(z.object({ id: z.coerce.number().int().min(1) }))
  .output(PlanetSchema)
  .handler(async ({ input }) => {
    // your find code here
    console.log(input);
    return { id: 1, name: "name" };
  });
const findPlanet = os
  .route({ method: "GET" })
  .input(z.object({ id: z.number().int().min(1) }))
  .output(PlanetSchema)
  .handler(async ({ input }) => {
    // your find code here
    console.log(input);
    return { id: 1, name: "name" };
  });
const findPlanetString = os
  .route({ method: "GET" })
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    // your find code here
    console.log(input);
    return { id: 1, name: "name" };
  });
export const contract = {
  // ...serverFnParallelContract,
}
export const router = {
  listPlanet,
  findPlanetCoerce,
  findPlanet,
  findPlanetString,
  ...serverFnParallelRouter,
};
