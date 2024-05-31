import { useMemo } from "react"

interface Props {
    variant?: "small" | "normal" | "big"
}

export default function Throbber({ variant = "normal" }: Props) {
    const wrapperClassName = useMemo(() => {
        if (variant === "small") return "block h-6 h-6"
        if (variant === "normal") return "block h-10 h-10"
        return "block h-14 h-14"
    }, [variant])

    const strokeWidth = 8
    const baseStrokeWidth = 2

    return (
        <span className={wrapperClassName}>
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