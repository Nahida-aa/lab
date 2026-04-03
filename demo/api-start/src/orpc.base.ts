import { onError, os } from '@orpc/server';
import type {
	RequestHeadersPluginContext,
	ResponseHeadersPluginContext,
} from '@orpc/server/plugins';
import z from 'zod';
import { getSession } from '#/lib/auth.func';

interface ORPCContext
	extends RequestHeadersPluginContext,
		ResponseHeadersPluginContext {}

export const base = os.$context<ORPCContext>().errors({
	// <-- common errors
	BAD_REQUEST: {},
	NOT_FOUND: {},
	UNAUTHORIZED: {},
	CONFLICT: {},
	FORBIDDEN: {},
	TOO_MANY_REQUESTS: {
		data: z.object({
			retryAfter: z.number(),
		}),
	},
	INTERNAL_SERVER_ERROR: {},
	// RATE_LIMITED: {
	// 	data: z.object({
	// 		retryAfter: z.number(),
	// 	}),
	// },
});

const logMiddleware = base.middleware(
	async ({ context, next, errors, path, procedure }, input) => {
		// , context.reqHeaders 服务器运行时 为 undefined
		// console.log('logMiddleware:', path, input);
		return next();
	},
);

export const Fn = base
	.route({})
	// .use(logMiddleware)
	.use(({ context, next, procedure, path }) => {
		if (procedure['~orpc'].route.method === 'GET') {
			// console.log("GET:", path);
			context.resHeaders?.set(
				'cache-control',
				'public, max-age=10, s-maxage=10, stale-while-revalidate=60', // s-maxage：是给 CDN / 代理服务器 看的; max-age：是给浏览器看的
			);
		}
		return next();
	})
	.use(
		onError((error, { context, next, path, errors }, input, output) => {
			// Execute logic after the handler
			// console.log('onError:',)
			// console.log({
			//   name: error.name,
			//   message: error.message,
			//   cause: error.cause,
			//   stack: error.stack,
			// })
		}),
	);
export const getFn = Fn.route({ method: 'GET' });

const authMiddleware = base.middleware(
	async ({ context, next, errors, path }) => {
		// context.reqHeaders ||
		const sessionData = await getSession();
		if (!sessionData?.session || !sessionData?.user) {
			throw errors.UNAUTHORIZED({
				message: 'Not Authorized',
			});
		}
		// Adds session and user to the context
		return next({
			context: {
				session: sessionData.session,
				user: sessionData.user,
			},
		});
	},
);
export const authFn = Fn.use(authMiddleware);
export const getAuthFn = authFn.route({ method: 'GET' });
/**
 * @deprecated Use authFn instead
 */
export const authOS = authFn;

const adminMiddleware = base.middleware(async ({ context, next, errors }) => {
	const sessionData = await getSession();
	if (
		!sessionData?.session ||
		!sessionData?.user ||
		!(sessionData?.user.role === 'admin')
	) {
		throw errors.UNAUTHORIZED({
			message: 'Not an admin',
		});
	}
	// Adds session and user to the context
	return next({
		context: {
			session: sessionData.session,
			user: sessionData.user,
		},
	});
});
export const adminFn = Fn.use(adminMiddleware);
export const getAdminFn = adminFn.route({ method: 'GET' });
