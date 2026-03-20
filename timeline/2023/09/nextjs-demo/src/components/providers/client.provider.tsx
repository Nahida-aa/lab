'use client'
// import { HeroUIProvider } from '@heroui/react'
import { ProgressProvider } from '@bprogress/next/app' // bun add @bprogress/next
import { QueryClientProvider } from '@tanstack/react-query'
import { getQueryClient } from '@/components/providers/get-query-client'
import {
  ReactQueryDevtools,
  ReactQueryDevtoolsPanel,
} from '@tanstack/react-query-devtools' // bun add @tanstack/react-query-devtools
// import { formatForDisplay, useHotkey } from '@tanstack/react-hotkeys'
import { useRouter } from 'next/navigation'
// import { ModalNavEffect } from '@/hooks/useModalNav'
// import { PathEffect } from '@/hooks/usePath'
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental'

// const Devtools = dev ? (await import('./Devtools')).default : () => null

export const CLientProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient()
  const router = useRouter()
  // useHotkey('Mod+,', () => {
  //   console.log(formatForDisplay('Mod+,'))
  //   router.push('/settings')
  // })
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        {/* <HeroUIProvider> */}
        <ProgressProvider
          height="3px"
          color="#a6e3a1"
          options={{ showSpinner: false }}
          shallowRouting
        >
          {/* <ToastProvider placement="top-right"
    toastProps={{
      // variant: "flat",
      timeout: 50000,
      classNames: {
        // closeButton: "opacity-100 absolute right-4 top-1/2 -translate-y-1/2",
        // base: 'items-start',
        content: 'items-start',
        icon: cn('size-5'),
        // wrapper: 'text-base',
        title: 'text-base',
        // description: 'm-1',
      },
    }}
    />  */}
          {children}
          {/* <ModalNavEffect />
          <PathEffect /> */}
        </ProgressProvider>
        {/* </HeroUIProvider> */}
      </ReactQueryStreamedHydration>
      {/* <Devtools /> */}
      {/* <TanStackDevtools // computations created outside a `createRoot` or `render` will never be disposed
        config={{
          // defaultOpen: true,
          openHotkey: ['Control', 'Alt'],
        }}
        plugins={[
          // {
          //   name: 'TanStack Query',
          //   render: <ReactQueryDevtoolsPanel />,
          //   defaultOpen: true,
          // },
          formDevtoolsPlugin(),
          // hotkeysDevtoolsPlugin(),
          {
            name: 'custom-devtools',
            render: <DevtoolPanel />,
          },
        ]}
        // eventBusConfig={{ debug: true }}
        // eventBusConfig={{
        //   debug: true,
        //   connectToServerBus: true,
        // }}
      /> */}
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
