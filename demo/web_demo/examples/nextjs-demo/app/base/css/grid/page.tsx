export default function VersionPage() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_20rem] lg:gap-6">
      {/* Title - 横跨所有列 */}
      <header className="lg:col-span-2 bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold">Version Title</h1>
        <div className="flex gap-3 mt-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
            Create
          </button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md">
            Cancel
          </button>
        </div>
      </header>

      {/* 左侧内容区 */}
      <div className="flex flex-col gap-4">
        {/* Changelog */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Changelog</h2>
          <textarea
            className="w-full h-32 p-3 border border-gray-300 rounded-md"
            placeholder="Describe what changed..."
          />
        </section>

        {/* Dependencies */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Dependencies</h2>
          <p className="text-gray-500">No dependencies added yet.</p>
        </section>

        {/* Files */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Files</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <p className="text-gray-500">Drag and drop files here</p>
          </div>
        </section>
      </div>

      {/* 右侧 Metadata - 关键是这里的设置 */}
      <aside className="bg-white rounded-lg shadow p-6  lg:row-span-4">
        <h2 className="text-lg font-semibold mb-6">Metadata</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Release Channel
            </label>
            <select className="w-full p-2 border border-gray-300 rounded-md">
              <option>Release</option>
              <option>Beta</option>
              <option>Alpha</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Version Number
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="1.0.0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Game Versions
            </label>
            <select className="w-full p-2 border border-gray-300 rounded-md">
              <option>1.20.1</option>
              <option>1.19.4</option>
            </select>
          </div>
        </div>
      </aside>
    </div>
  )
}