import { useMemo } from "react"

import { cn } from "@/lib/utils"

interface Props {
    variant?: "small" | "normal" | "big"
    className?: string
}

export function Throbber({ variant = "normal", className }: Props) {
    const wrapperClassName = useMemo(() => {
        if (variant === "small") return "block h-5 h-5"
        if (variant === "normal") return "block h-10 h-10"
        return "block h-12 h-12"
    }, [variant])

    const strokeWidth = 8
    const baseStrokeWidth = 2

    return (
        <span className={cn(className, wrapperClassName)}>
            <svg
                className="animate-spin"
                stroke="currentColor"
                fill="none"
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
            >
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    className="opacity-50"
                    strokeWidth={baseStrokeWidth}
                ></circle>
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    strokeDasharray={300}
                    strokeDashoffset={225}
                    strokeWidth={strokeWidth}
                ></circle>
            </svg>
        </span>
    )
}