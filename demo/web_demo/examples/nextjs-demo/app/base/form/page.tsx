export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    type?: string;
    status?: string;
  }>;
}) {
  const { q: searchTerm = "", type, status = "" } = await searchParams;
  return (
    <section>
      <form action="/studio/projects" method="get" className="mb-4">
        <input
          type="text"
          name="q"
          defaultValue={searchTerm}
          placeholder="搜索项目..."
          className="border rounded px-3 py-1"
        />
        <button
          type="submit"
          className="ml-2 px-3 py-1 bg-blue-500 text-white rounded"
        >
          搜索
        </button>
      </form>
    </section>
  );
}
