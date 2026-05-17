"use client";
export default function Page() {
  return (
    <main>
      <div className="group border p-4 bg-green-400 has-disabled:bg-gray-400 has-disabled:cursor-not-allowed cursor-pointer ">
        <input
          type="file"
          className="bg-blue-400 cursor-pointer disabled:bg-gray-500  disabled:cursor-not-allowed  "
          placeholder="placeholder"
          disabled
          readOnly
        />
      </div>
      <div className="group border p-4 bg-green-400 group-disabled:bg-gray-400  has-[input:disabled]:cursor-not-allowed">
        <input
          type="file"
          className="disabled:cursor-not-allowed bg-blue-400"
          placeholder="placeholder"
          disabled
          readOnly
        />
      </div>
    </main>
  );
}
