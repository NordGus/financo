import { ReactNode } from "react"
import { NavLink as RouterNavLink } from "react-router-dom"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const linkVariants = cva(
    "flex h-9 w-10 items-center justify-center rounded-lg transition-colors md:h-10 md:w-10",
    {
        variants: {
            variant: {
                active: "bg-zinc-950 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-950",
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