"use client";
import { use, useEffect } from "react";
import { Button } from "../ui/button";
import { UxAlert } from "../uix/alert";
import { Pre } from "../uix/CodeBlock/pre";

export function ErrorCard({
  error,
  reset,
  back,
}: {
  error: Error;
  reset: () => void;
  back?: () => void;
}) {
  // const t = useTranslations();
  // useEffect(() => {
  //   // Log the error to an error reporting service
  //   console.error(error)
  // }, [error])
  return (
    <div className={"grid place-items-center  w-full h-full"}>
      <main className="bg-card rounded-md shadow-lg p-6 h-fit sm:max-w-md w-full flex flex-col gap-3">
        {/* <h2>Something went wrong!</h2> */}
        <UxAlert variant={"destructive"} title={error.message} />
        <Pre
          className="min-h-0"
          json={{ error, cause: error.cause, stack: error.stack }}
        />
        {/* <CodeBlock
          code={error.stack || ''}
          language="tex"
          className="max-h-96"
          filename="stack"
        /> */}
        <div className="flex gap-2 justify-end">
          <Button onClick={back}>返回</Button>
          <Button color="primary" onClick={reset}>
            Try again
          </Button>
        </div>
      </main>
    </div>
  );
}
