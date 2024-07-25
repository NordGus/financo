import { PropsWithChildren } from "react"

interface ControlProps {
    onClick: React.MouseEventHandler<HTMLParagraphElement>,
    className?: string
}

export default function Control({ children, onClick, className }: PropsWithChildren<ControlProps>) {
    return <span
        className={`px-4 py-2 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 rounded shadow overflow-clip text-zinc-950 dark:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer ${className ? className : ""}`}
        onClick={onClick}
    >
        {children}
    </span>
}