import { ReactNode } from "react"
import { NavLink as RouterNavLink } from "react-router-dom"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const linkVariants = cva(
    "flex p-0 m-0 items-center justify-center rounded transition-colors",
    {
        variants: {
            variant: {
                active: "text-zinc-950 dark:text-zinc-50",
                pending: "bg-zinc-950 dark:bg-zinc-50 text-zinc-950 dark:text-zinc-50 animate-pulse",
                default: "text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50"
            }
        },
        defaultVariants: {
            variant: "default",
        }
    },
)

interface Props {
    name: string
    icon: ReactNode
    path: string
}

function NavLink({ icon, name, path }: Props) {
    return (
        <Tooltip delayDuration={0}>
            <TooltipTrigger>
                <RouterNavLink
                    to={path}
                    className={({ isActive, isPending }) => cn(linkVariants({
                        variant: isActive
                            ? "active"
                            : isPending
                                ? "pending"
                                : undefined
                    }))
                    }
                >
                    {icon}
                </RouterNavLink>
            </TooltipTrigger>
            <TooltipContent side="right">{name}</TooltipContent>
        </Tooltip>
    )
}

export default NavLink