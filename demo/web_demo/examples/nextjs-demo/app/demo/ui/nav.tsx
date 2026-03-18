"use client"
// https://nextjs.org/docs/app/getting-started/layouts-and-pages#creating-a-dynamic-segment

import { Tab, Tabs, type TabsProps } from "@heroui/react";
import { MessageCircle, SettingsIcon, Tags, UsersIcon, type LucideProps } from "lucide-react"
import { redirect, useParams, usePathname, useRouter, useSearchParams, useSelectedLayoutSegment, useSelectedLayoutSegments } from "next/navigation"
import type { ForwardRefExoticComponent, JSX, RefAttributes } from "react"
import { DocumentTextIcon } from "./icons"
import { useAuthSession } from "@/lib/auth/auth.provider"
import { cn } from "@/lib/utils";
import { Button, LinkButton } from "./form/button";
import { BetterTooltip } from "@/components/common/BetterTooltip";
import { Badge } from "@/components/ui/badge";
import { addSearchParams } from "@/app/demo/utils/url";

type Icon = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>> | ((props: LucideProps) => JSX.Element)
// path (key) to icon map
const iconMap: Record<string, Icon> = {
  "settings": SettingsIcon,
  "settings/description": DocumentTextIcon,
  "settings/members": UsersIcon,
  "settings/tags": Tags,
  'forum': MessageCircle,
}

export interface NavItem {
  key: string
  icon?: Icon
  label?: string
  description?: string
  badge?: string | number
  // children?: NavItem[]; // 下拉子项
}

export const Nav = ({ basePath = '', baseSegment,
  isVertical = false, items, withIcon = true, includeSubPath = false,
  classNames,
}: TabsProps<NavItem> & {
  basePath?: string,
  baseSegment?: string,
  withIcon?: boolean,
  includeSubPath?: boolean,
  classNames?: {
    ul?: string,
  }
  // items: NavItem[]
}) => {
  // const pathname = usePathname()
  const segment = useSelectedLayoutSegment()
  const searchParams = useSearchParams()

  const currentKey = baseSegment && segment
    ? `${baseSegment}/${segment}`
    : baseSegment && !segment
      ? baseSegment
      : segment ? segment : ''
  console.log('currentKey', currentKey)
  // const router = useRouter()
  return <nav >
    <ul className={cn('flex gap-1 bg-card  p-0.5 w-fit rounded-md',
      isVertical ? 'flex-col' : 'flex-row',
      classNames?.ul)}>
      {items?.map((item) => {
        const Icon = item.icon ?? iconMap[item.key];
        const itemPath = `${basePath}/${item.key}`
        return <li key={item.key}
          className={cn(
            currentKey === item.key
              ? ' text-primary'
              : '', 'rounded-md  hover:bg-primary/80 hover:text-primary-foreground',)}
        >
          {item.description ? (<BetterTooltip content={item.description}>
            <LinkButton className="bg-transparent"
              href={addSearchParams(itemPath, searchParams)}
              startContent={withIcon && Icon && <Icon size={16} />}
              endContent={item.badge && <Badge>{item.badge}</Badge>} >
              {item.label ? item.label : item.key === '' ? '/' : item.key}
            </LinkButton>
          </BetterTooltip>
          ) : (
            <LinkButton className="bg-transparent"
              href={addSearchParams(itemPath, searchParams)}
              startContent={withIcon && Icon && <Icon size={16} />}
              endContent={item.badge && <Badge>{item.badge}</Badge>} >
              {item.label ? item.label : item.key === '' ? '/' : item.key}
            </LinkButton>
          )}
        </li>
      })}
    </ul>
  </nav >
}