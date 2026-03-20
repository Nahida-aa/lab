import type { ComponentProps } from 'react'
import { ServerImage } from './ServerImage'
import { cn } from '@/lib/utils'
import { getDefaultAvatar } from '@/modules/auth/utils/avatar'
import { NoStyleLink } from '@/components/uix/link'
import type { OnlineStatus } from '@/lib/ws/types'
import { CircleMinus, Moon } from 'lucide-react'

export const StatusAvatar = ({
  href,
  src,
  name,
  size = 'default',
  isOnline,
  onlineStatus,
  className,
  rootClassName,
  statusClassName,
  ...props
}: Omit<ComponentProps<typeof ServerImage>, 'alt' | 'width' | 'height' | 'src'> & {
  href?: string
  name?: string
  size?: 'default' | 'sm' | 'lg' | 'xl'
  src?: string | null
  isOnline?: boolean
  onlineStatus?: OnlineStatus
  rootClassName?: string
  statusClassName?: string
}) => {
  const sizeMap = {
    default: {
      image: 8, // 8*4 = 32px
      status: 2.5, // 2.5*4 = 10px
    },
    sm: {
      image: 6,
      status: 2.5,
    },

    lg: {
      image: 10, // 10*4 = 40px
      status: 4, //
    },
    xl: {
      image: 20, // 20*4 = 80px
      status: 4, //
    },
  }
  const src1 = src || getDefaultAvatar(name || 'null', sizeMap[size].image * 4)

  const ret = (
    <span className={cn('flex relative h-fit rounded-full', rootClassName)}>
      <ServerImage
        src={src1}
        alt={name || 'avatar'}
        width={sizeMap[size].image * 4}
        height={sizeMap[size].image * 4}
        className={cn(
          `rounded-full min-w-${sizeMap[size].image} min-h-${sizeMap[size].image}`,
          className,
        )}
        {...props}
      />
      <span
        data-slot="status-dot"
        className={cn(
          'absolute -bottom-0.5 -right-0.5 border-card  border-3 rounded-full',
          'size-fit flex',
          // {
          //   'border'
          // },
          statusClassName,
        )}
      >
        <StatusDot
          status={onlineStatus}
          size={sizeMap[size].status * 4}
          className="bg-card"
        />
        {/* <span
          className={cn(
            'rounded-full flex',
            `size-${sizeMap[size].status}`,
            isOnline ? 'bg-green-500' : 'bg-gray-500',
            onlineStatus === 'online' && 'bg-green-500',
            onlineStatus === 'offline' && 'bg-gray-500',
            onlineStatus === 'idle' && 'bg-yellow-500',
            onlineStatus === 'dnd' && 'bg-red-500',
            onlineStatus === 'invisible' && 'bg-gray-500',
          )}
        /> */}
      </span>
    </span>
  )

  if (href) {
    return <NoStyleLink href={href}>{ret}</NoStyleLink>
  }
  return ret
}

export function StatusDot({
  status = 'offline',
  size = 10,
  className = '',
}: {
  status?: OnlineStatus
  size?: number
  className?: string
}) {
  if (status === 'online') {
    return <span className={`rounded-full bg-green-500 size-${size / 4}`} />
  } else if (status === 'dnd') {
    return (
      <CircleMinus
        color="#fb2c36"
        size={size}
        strokeWidth={size / 5}
        absoluteStrokeWidth
        className={`size-${size / 4} ${className}`}
      />
    )
  } else if (status === 'idle') {
    return (
      <Moon
        color="#e5c890"
        size={size}
        strokeWidth={size / 5}
        absoluteStrokeWidth
        className={`size-${size / 4} ${className}`}
      />
    )
  } else if (status === 'offline' || status === 'invisible') {
    return <span className={`rounded-full bg-gray-500 size-${size / 4}`} />
  }
}
