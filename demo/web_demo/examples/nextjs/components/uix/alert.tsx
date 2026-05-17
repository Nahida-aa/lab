import { CheckCircle2, CircleX, Info, TriangleAlert } from "lucide-react";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "../ui/alert";

// 图标映射表
const variantIcons = {
  info: Info,
  warning: TriangleAlert,
  success: CheckCircle2,
  destructive: CircleX, // CircleX, AlertCircleIcon
} as const;

export function UxAlert({
  className,
  variant = "info",
  children,
  title,
  description,
  ...props
}: React.ComponentProps<typeof Alert> & {
  description?: string;
}) {
  const Icon = variantIcons[variant || "info"] ?? Info;
  return (
    <Alert className={className} variant={variant} {...props}>
      <Icon className="size-5" />
      {title && <AlertTitle>{title}</AlertTitle>}
      {description && <AlertDescription>{description}</AlertDescription>}
      {children && <AlertAction>{children}</AlertAction>}

      {/* 自动换行 */}
      {/* line-clamp-1 */}
      {/* <div className="col-start-2  min-h-4 font-medium tracking-tight">
        <p className="wrap-break-word break-keep relative top-[0.7px]">
          {children}
        </p>
      </div> */}
    </Alert>
  );
}
