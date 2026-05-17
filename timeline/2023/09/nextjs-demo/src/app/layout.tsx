import type { Metadata } from 'next'
import '@/styles/globals.css';
import '../lib/client/orpc.server' // for pre-rendering
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider"
import { TooltipProvider } from '@/components/ui/tooltip';
import { CLientProvider } from '@/components/providers/client.provider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Nextjs Demo',
  description: 'Next, better-auth, oRPC'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <html lang="en" suppressHydrationWarning>
    <body  className={`${geistSans.variable} ${geistMono.variable} antialiased`}>          
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <CLientProvider>

          {children}
          </CLientProvider>
          </TooltipProvider>
        {/* <DebugPanel /> */}
      </ThemeProvider>
    </body>
  </html>
}
