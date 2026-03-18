import "./globals.css";
import { AppHead } from "@/components/layout/AppHead";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div>
        <AppHead />
        {children}
      </div>
    </SidebarProvider>
  );
}
