import { PropsWithChildren } from "react"

interface CleanProps {
    className?: string,
}

export default function Base({ className, children }: PropsWithChildren<CleanProps>) {
    return (
        <div
            className={`bg-neutral-50 dark:bg-neutral-900 rounded shadow overflow-clip text-neutral-950 dark:text-neutral-50 ${className}`}
        >
            {children}
        </div>
    )
}