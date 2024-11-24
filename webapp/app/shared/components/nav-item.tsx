import { cva } from "class-variance-authority";
import { PropsWithChildren } from "react";
import { NavLink } from "react-router";
import { cn } from "~/lib/utils";

const linkVariants = cva(
  "inline-flex items-center justify-center gap-2 p-2 rounded-md [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        "active": "text-foreground dark:text-foreground",
        "pending": "bg-background text-foreground animate-pulse",
        "default": "text-foreground/50 hover:text-foreground"
      }
    },
    defaultVariants: {
      variant: "default",
    }
  },
)

interface Props {
  to: string
}

export function NavItem({ to, children }: PropsWithChildren<Props>) {
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
        })
      )}
    >
      {children}
    </NavLink>
  )
}