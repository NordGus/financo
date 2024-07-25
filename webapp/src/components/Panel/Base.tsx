import { PropsWithChildren, ReactNode } from "react"

interface BaseProps {
    header: ReactNode,
    className?: string,
}

export default function Base({ header, className, children }: PropsWithChildren<BaseProps>) {
    return (
        <div
            className={`flex flex-col bg-zinc-50 dark:bg-zinc-900 divide-y dark:divide-zinc-800 rounded shadow overflow-clip text-zinc-950 dark:text-zinc-50 ${className}`}
        >
            <div
                className="flex justify-between items-stretch min-h-10 h-10 max-h-10"
            >
                {header}
            </div>
            {children}
        </div>
    )
}