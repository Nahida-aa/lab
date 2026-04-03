import { createAuthClient } from 'better-auth/react'

import {
	adminClient,
	// anonymousClient,
	// customSessionClient,
	// emailOTPClient,
	// phoneNumberClient,
	// twoFactorClient,
	// usernameClient,
} from 'better-auth/client/plugins';
import { env } from '#/env';

export const authClient = createAuthClient({
  baseURL: env.VITE_APP_URL,
  plugins: [
    adminClient(),
  ]
})
