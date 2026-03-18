// https://nextjs.org/docs/app/getting-started/layouts-and-pages#creating-a-dynamic-segment

import { Nav, type NavItem } from "@/app/demo/ui/nav"

const navItems: NavItem[] = [
  { key: "demo" },
  { key: "demo/routes/parallel" },
  { key: "demo/routes/parallel/login" },
  { key: "demo/ui/css/grid" },
]

export default async function Layout({
  children,
}: {
  children: React.ReactNode,
}) {
  return <section className="min-h-screen flex">
    <Nav items={navItems} isVertical />
    {children}
  </section>
}