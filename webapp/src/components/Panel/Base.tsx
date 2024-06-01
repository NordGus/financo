import { PropsWithChildren, ReactNode } from "react"

interface BaseProps {
    header: ReactNode,
    className?: string,
}

export default function Base({ header, className, children }: PropsWithChildren<BaseProps>) {
    return (
        <div
            className={`flex flex-col bg-neutral-50 dark:bg-neutral-900 divide-y dark:divide-neutral-800 border dark:border-neutral-800 rounded shadow overflow-clip text-neutral-950 dark:text-neutral-50 ${className}`}
        >
            <div
                className="flex justify-between items-stretch min-h-10 h-10 max-h-10 divide-x dark:divide-neutral-800"
            >
                {header}
            </div>
            {children}
        </div>
    )
}