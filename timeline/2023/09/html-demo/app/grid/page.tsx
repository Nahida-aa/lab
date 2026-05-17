"use client";

// leftRight

export default function Page() {
  return (
    <div className='h-screen flex flex-row bg-red-100' >
      {/* 左侧内容 */}
      <div className="w-50 bg-gray-50 m-2" >
        <div>
          左侧固定宽度的基准（根据内容）
        </div>
        <UserRoleSwitcher className="w-fit flex-none bg-amber-800 rounded-md my-2 min-w-0 max-w-full" />
      </div>
      {/* 右侧内容 */}
      <div className="flex-1 bg-cyan-800" >
        右侧自适应宽度
      </div>
    </div>
  );
}

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import Link from 'next/link';
// import { LoadingS } from '@/components/ui/loading/Loading';

const roleList = [
  { label: "游客", key: "guest", icon: "👤" },
  { label: "鉴赏家", key: "connoisseur", icon: "🎨" },
  { label: "创作者", key: "creator", icon: "✏️" },
  { label: "施工者", key: "developer", icon: "💻" },
  { label: "投资者", key: "investor", icon: "💼" },
];

export const UserRoleSwitcher = ({
  className = '',
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const role = searchParams.get('role')
  const [value, setValue] = useState(role)

  const onValueChange = (value: string) => {
    setValue(value)
    console.log("onValueChange" , value)
    router.push(`?role=${value}`)
  }

  return (
  // <Suspense fallback={<LoadingS />} >
    <section className={`h-fit overflow-x-auto ${className}`} >
      <ToggleGroup className='min-w-fit w-full h-12' type="single" value={value||"guest"} onValueChange={onValueChange}>
        {roleList.map((role) => (
          <ToggleGroupItem key={role.key} value={role.key} aria-label={role.label} className='m-2 h-8 p-0 rounded-md data-[state=off]:bg-amber-500'>
            <span>{role.icon}</span><span>{role.label}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </section>
  // </Suspense >
  );
};
