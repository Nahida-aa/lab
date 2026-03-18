import React from 'react';

export default function Page() {
  return (
    <main className='grid grid-cols-[1fr_auto] gap-3 w-full'>
      <article className=" md p-4 bg-card rounded-lg ">{
        // 25 个 div 元素
        Array(25).fill(null).map((_, index) => <div key={index} className=" " >
          {
            // 10 个 span 元素
            Array(10).fill(null).map((_, index) => <span key={index} className='w-40 inline-block' >{index}  </span>)
          }
        </div>)
      }</article>
      <aside aria-label="Detail-side" className="space-y-3 min-w-50">
        <section className='bg-card'>aside1</section>
        <section className='bg-card'>aside</section>
      </aside>
    </main>
  );
}