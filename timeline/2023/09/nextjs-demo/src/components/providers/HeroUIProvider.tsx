'use client'
// app/providers.tsx

import { HeroUIProvider } from '@heroui/system'

export function UIProviders({ children }: { children: React.ReactNode }) {
  return <HeroUIProvider>{children}</HeroUIProvider>
}
