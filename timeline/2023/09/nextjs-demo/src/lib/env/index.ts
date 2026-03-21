
import packageJson from '../../../package.json'
import { createEnv } from '@t3-oss/env-nextjs' // bun add @t3-oss/env-nextjs zod
import { z } from 'zod'
import { dev } from './base'
export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    // REDIS_URL: z.url(),
    BETTER_AUTH_SECRET:
      z.string(),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    // API_MY_KEY: z.string().min(1),
  },
  client: {
    // NEXT_PUBLIC_S3_URL: z.url(),
    NEXT_PUBLIC_APP_URL: z.url(),
    // NEXT_PUBLIC_API_URL: z.url(),
    NEXT_PUBLIC_VERSION: z.string().min(1),
    // NEXT_PUBLIC_PARTYKIT_HOST: z.string().min(1),
  },
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    // REDIS_URL: process.env.REDIS_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    // NEXT_PUBLIC_S3_URL: process.env.NEXT_PUBLIC_S3_URL,
    NEXT_PUBLIC_APP_URL: dev ? `http://localhost:${process.env.PORT || 3000}` :
      `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`,
    // NEXT_PUBLIC_API_URL: dev ? `http://localhost:4000` : process.env.NEXT_PUBLIC_API_URL,
    // NEXT_PUBLIC_PARTYKIT_HOST: process.env.NEXT_PUBLIC_PARTYKIT_HOST ?? '127.0.0.1:1999',
    NEXT_PUBLIC_VERSION: packageJson.version,
    // API_MY_KEY: process.env.API_MY_KEY,
  },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  // experimental__runtimeEnv: {
  //   NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
  // }
})
// export const PARTYKIT_HOST = env.NEXT_PUBLIC_PARTYKIT_HOST
// export const PROTOCOL = PARTYKIT_HOST.startsWith('127.0.0.1') ? 'http' : 'https'
// export const PARTYKIT_URL = `${PROTOCOL}://${PARTYKIT_HOST}`
