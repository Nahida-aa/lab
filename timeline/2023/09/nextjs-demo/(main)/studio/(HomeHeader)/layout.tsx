

import { HomeHeader } from '~/components/layout/header/home-header';
import { server_auth } from '~/app/(auth)/auth';
import { ScrollShadow } from '@heroui/scroll-shadow';

// export const experimental_ppr = true; // next

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await server_auth();
  return (
    <> 
      <HomeHeader user={session?.user} className='bg-card/80'  />
      <ScrollShadow hideScrollBar className="h-screen">

      {children}
      </ScrollShadow>
    </>
  );
}
