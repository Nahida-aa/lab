import type { Hook } from "zod";
import { UNPROCESSABLE_ENTITY } from "./http-status-codes";

const defaultHook: Hook<any, any, any, any> = (result, c) => {
  if (!result.success) {
    // return c.json({
    //   success: result.success,
    //   error: result.error,
    // },
    //   UNPROCESSABLE_ENTITY,
    // );
    return c.json(result.error, UNPROCESSABLE_ENTITY);
  }
};

export default defaultHook;
