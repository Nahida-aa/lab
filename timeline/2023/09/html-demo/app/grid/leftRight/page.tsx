"use client";


export default function Page() {
  return (
    <div className='h-screen flex flex-row bg-red-100' >
      {/* 左侧内容 */}
      <div className="w-[200px] bg-gray-950 m-2" >
        <div>
          左侧固定宽度的基准
        </div>
      </div>
      {/* 右侧内容 */}
      <div className="flex-1 bg-cyan-800" >
        右侧自适应宽度
      </div>
    </div>
  );
}