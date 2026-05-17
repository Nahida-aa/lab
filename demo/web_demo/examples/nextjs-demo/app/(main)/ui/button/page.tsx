import { Button } from "@heroui/button"
import { Plus } from "lucide-react"

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = await params
  const { page = '1', sort = 'asc', query = '' } = await searchParams
  return <section>
    <h1>Page</h1>
    <p>This is the Page page.</p>
    <Button
      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
      variant="shadow"
    >
      <Plus className="w-4 h-4 " />
      创建项目
    </Button>
  </section>
}