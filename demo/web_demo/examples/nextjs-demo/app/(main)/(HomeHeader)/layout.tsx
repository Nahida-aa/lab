import { cookies } from "next/headers";

import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { HomeHeader } from "@/components/layout/header/home-header";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScrollShadow } from "@heroui/scroll-shadow";
import sApi from "@/api/app/client/server";

// export const experimental_ppr = true; // next

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await sApi.getSession();
  return (
    <>
      <HomeHeader user={session?.user} className="bg-card/80" />
      <ScrollShadow hideScrollBar className="h-screen">
        {children}
      </ScrollShadow>
    </>
  );
}
