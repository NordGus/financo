import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps } from "class-variance-authority"
import * as React from "react"
import { NavLink, NavLinkProps } from "react-router-dom"
import { buttonVariants } from "./button-variants"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

const NavButton: React.FC<NavLinkProps & ButtonProps> = ({
  to, className, children, variant = "outline", ...rest
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        buttonVariants({ variant }),
        (isActive && "bg-zinc-100 dark:bg-zinc-800"),
        className,
      )}
      {...rest}
    >
      {children}
    </NavLink>
  )
}

NavButton.displayName = "NavButton"

export { Button, NavButton }
