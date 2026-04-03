import { env } from '#/env'
import { betterAuth } from 'better-auth'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import * as schema from '#/db.schema'; // Import the 
import { db } from '#/db.server';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import {
	openAPI,
  admin,
} from 'better-auth/plugins';
export const auth = betterAuth({
  baseURL: env.VITE_APP_URL,
  	database: drizzleAdapter(db, {
		provider: 'pg', // or "mysql", "sqlite"
		// schema: {
		//   // ...schema,
		//   user: schema.user,
		// },
		schema: schema,
	}),
	experimental: { joins: true },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [tanstackStartCookies()
    ,
    admin(),
    openAPI(), // basePath/reference: open-api doc
  ],
})
