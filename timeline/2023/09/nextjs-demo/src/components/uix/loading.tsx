import { Spinner } from '../ui/spinner'
import { cn } from '@/lib/utils'

export function Loading({
  className = 'size-6 text-primary',
  ...props
}: React.ComponentProps<'svg'>) {
  return <Spinner className={className} {...props} />
}

export function LoadingPage() {
  return (
    <div className="size-full flex justify-center">
      <Spinner className="size-20" />
    </div>
  )
}

export function Skeleton({
  className,
  isPulse = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  isPulse?: boolean
}) {
  return (
    <div
      className={cn('rounded-md bg-accent', { 'animate-pulse': isPulse }, className)}
      {...props}
    />
  )
}
