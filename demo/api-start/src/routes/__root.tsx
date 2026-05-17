import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { SIDEBAR_COOKIE_NAME, SidebarProvider } from '#/components/ui/sidebar'
import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'
import { DemoFooter } from '#/routes/demo/-comp/layout/Footer'
import { DemoHeader } from '#/routes/demo/-comp/layout/Header'
import { DemoSidebar } from '#/routes/demo/-comp/layout/sidebar'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { scrollbarDefault } from '#/css'

interface MyRouterContext {
  queryClient: QueryClient
}

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

const getSidebarOpen = createServerFn().handler(
	() => getCookie(SIDEBAR_COOKIE_NAME) !== 'false',
);
export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  	loader: async ({ context }) => {
		return {
			sidebarOpen: await getSidebarOpen(),
		};
	},
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = Route.useLoaderData();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased wrap-anywhere selection:bg-[rgba(79,184,178,0.24)] overflow-hidden scrollbar-gutter-stable">
   
        		<SidebarProvider
			defaultOpen={sidebarOpen}
			width="16rem"
			mobileWidth="18rem"
		>
			<DemoSidebar />
			<section className={`flex h-screen max-h-screen flex-col overflow-hidden w-full `}>
				<DemoHeader />

				<div data-name="main" className={`flex-1 overflow-y-auto ${scrollbarDefault}`}>
					<Outlet />
					<DemoFooter />
				</div>
			</section>
		</SidebarProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Query',
              render: <ReactQueryDevtoolsPanel />,
            },
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
