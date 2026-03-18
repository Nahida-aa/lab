import Link, { type LinkProps } from "next/link";
import { forwardRef, type AnchorHTMLAttributes } from "react";
import clsx from "clsx";

type NoStyleLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    className?: string;
  };

export const NoStyleLink = ({
  children,
  className,
  ...props
}: NoStyleLinkProps) => {
  return (
    <Link {...props} className={clsx("text-inherit no-underline inline-flex items-center", className)}>
      {children}
    </Link>
  );
};
