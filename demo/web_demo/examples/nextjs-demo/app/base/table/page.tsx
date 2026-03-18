// https://ui.shadcn.com/docs/components/data-table
import { columns, Payment } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52g",
      amount: 200,
      status: "success",
      email: "c@example.com",
    },
    // 生成 20 条数据
    ...Array.from({ length: 20 }, (_, i) => ({
      id: `id-${i}`,
      amount: Math.floor(Math.random() * 1000),
      status: ["pending", "processing", "success", "failed"][
        Math.floor(Math.random() * 4)
      ] as "pending" | "processing" | "success" | "failed",
      // 生成一个简单的假 email
      email: `user${i}@example.com`,
    })),
  ];
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
