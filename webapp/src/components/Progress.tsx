import { ReactNode } from "react"
import { isNil } from "lodash"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"


interface Props {
    progress: number
    color?: string
    icon?: ReactNode,
    className?: string
}

export function Progress({ progress, color, icon, className }: Props) {
    const dasharray = 300
    const fillStrokeWidth = 10
    const baseStrokeWidth = 3

    return (
        <div
            className={
                cn(
                    "m-auto w-10 h-10 relative",
                    className
                )
            }
            style={{ color: color }}
        >
            <span
                className="absolute bottom-0 top-0 right-0 left-0 flex justify-center items-center"
            >
                <svg
                    className="rotate-[270deg]"
                    viewBox="0 0 100 100"
                    width="100%"
                    height="100%"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle
                        cx="50" cy="50" r="45"
                        strokeWidth={baseStrokeWidth}
                    ></circle>
                    {
                        progress < 1.0 && (
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                strokeDashoffset={Math.floor(dasharray - (progress * dasharray))}
                                strokeDasharray={dasharray}
                                strokeWidth={fillStrokeWidth}
                            ></circle>
                        )
                    }
                </svg>
            </span>
            {progress < 1.0
                ? (
                    <p
                        className="leading-none absolute bottom-0 top-0 right-0 left-0 flex justify-center items-center p-0 m-0"
                    >
                        {Math.floor(progress * 100)}
                    </p>
                ) : (
                    <span
                        className="absolute bottom-0 top-0 right-0 left-0 flex justify-center items-center"
                    >
                        {
                            isNil(icon)
                                ? <CheckIcon size={20} />
                                : icon
                        }
                    </span>
                )
            }
        </div>
    )
}