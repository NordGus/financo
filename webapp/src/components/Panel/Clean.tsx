import { PropsWithChildren } from "react"

interface CleanProps {
    className?: string,
}

export default function Base({ className, children }: PropsWithChildren<CleanProps>) {
    return (
        <div
            className={`bg-zinc-50 dark:bg-zinc-900 rounded shadow overflow-clip text-zinc-950 dark:text-zinc-50 ${className}`}
        >
            {children}
        </div>
    )
}