import { PropsWithChildren } from "react"

interface CleanProps {
    className?: string,
}

export default function Base({ className, children }: PropsWithChildren<CleanProps>) {
    return (
        <div
            className={`flex flex-col bg-neutral-50 dark:bg-neutral-900 divide-y dark:divide-neutral-800 rounded shadow overflow-clip text-neutral-950 dark:text-neutral-50 ${className}`}
        >
            {children}
        </div>
    )
}