// https://nextjs.org/docs/app/getting-started/layouts-and-pages#creating-a-dynamic-segment

import { ModalProvider } from "@/app/a/ui/modal/modal.provider";
import { Nav, type NavItem } from "@/app/a/ui/base/nav";

const navItems: NavItem[] = [
  { key: "a" },
  { key: "a/action" },
  { key: "a/action/demo" },
  { key: "a/action/useActionState" },
  { key: "a/action/swr" },
  { key: "a/ui/form" },
  { key: "a/ui/form/dialog" },
  { key: "a/ui/form/select" },
  { key: "a/ui/modal" },
  { key: "a/ui/css/grid" },
  { key: "a/ui/toast" },
  { key: "a/routes/parallel" },
  { key: "a/routes/parallel/login" },
];

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ModalProvider>
      <section className="min-h-screen flex">
        <Nav baseSegment="a" items={navItems} isVertical />
        {children}
      </section>
    </ModalProvider>
  );
}
