import { OpenAPIHono, RouteConfig, RouteHandler } from "zod";
import { AppEnv } from "../app/create";

export type AppOpenAPI = OpenAPIHono<AppEnv>;
export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R>;
