import { cva } from "class-variance-authority";
import { PropsWithChildren } from "react";
import { NavLink, NavLinkProps } from "react-router";
import { cn } from "~/lib/utils";

const linkVariants = cva(
  "inline-flex items-center justify-start gap-4 rounded-md [&_svg]:pointer-events-none [&_svg]:size-7 [&_svg]:shrink-0 leading-none p-2",
  {
    variants: {
      variant: {
        "active": "text-foreground dark:text-foreground bg-muted",
        "pending": "bg-background text-foreground animate-pulse",
        "default": "text-muted-foreground hover:text-foreground hover:bg-muted"
      }
    },
    defaultVariants: {
      variant: "default",
    }
  },
)

export function NavMenuItem({ to, children, ...props }: PropsWithChildren<NavLinkProps>) {
  return (
    <NavLink
      to={to}
      className={({ isActive, isPending }) => cn(
        linkVariants({
          variant:
            isActive
              ? "active"
              : isPending
                ? "pending"
                : undefined
        }),
      )}
      {...props}
    >
      {children}
    </NavLink>
  )
}