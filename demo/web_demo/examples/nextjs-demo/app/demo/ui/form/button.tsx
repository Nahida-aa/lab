import { NoStyleLink } from "../link"
import { cn } from "@/lib/utils"
import { Button as HeroButton, type ButtonProps } from "@heroui/button"
import { SaveIcon } from "lucide-react"

export const Button = ({ size = 'sm', className, startContent, children, color, ...props }: ButtonProps) => {
  return <HeroButton className={cn(
    'rounded-md leading-[1.15] [&>svg]:size-[1.1rem]',
    color ? `bg-${color} text-${color}-foreground` : 'bg-input text-foreground', className)}
    size={size} {...props} startContent={startContent}>{startContent ? <span className="leading-none relative top-[0.9px]">{children}</span> : children}</HeroButton>
}

export const LinkButton = ({ href, children, className, color, ...props }: ButtonProps & { href: string }) => <NoStyleLink href={href}>
  {/* 使用父元素 */}
  <Button className={cn(' text-inherit font-semibold', className)} color={color} {...props}>{children}</Button>
</NoStyleLink>


export const SaveButton = ({ type = 'submit', color = 'primary', children = '保存变更', startContent = <SaveIcon />, ...props }: ButtonProps) => {
  return <Button {...props} type={type} color={color} startContent={startContent}>{children}</Button>
}