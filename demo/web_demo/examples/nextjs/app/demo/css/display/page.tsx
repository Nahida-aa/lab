"use client";

import { ErrorCard } from "@/components/layout/error";
import { useReset } from "@/hooks/useReset";

export default function Page() {
  const error = new Error("Something went wrong");
  return (
    <div className="w-full h-screen grid grid-rows-[auto_1fr]">
      <header>
        <button>button</button>
      </header>
      <ErrorCard error={error} reset={useReset()} />
    </div>
  );
}
