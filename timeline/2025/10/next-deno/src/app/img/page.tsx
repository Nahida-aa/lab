// https://nextjs.org/docs/app/getting-started/layouts-and-pages#creating-a-dynamic-segment

import { Img2Ico } from "@/app/img/Img2Ico";

// https://nextjs.org/docs/app/getting-started/layouts-and-pages#rendering-with-search-params
export default async function Page() {

  return (
    <main>
      <h1>Page</h1>
      <p>This is the Page page.</p>
      <p>
        {1 + 1 * 2}
        {(1 + 1) * 2}
        {(1) * 2}
      </p>
      <Img2Ico />
    </main>
  )
}