import { PropsWithChildren } from "react"

interface ControlProps {
    onClick: React.MouseEventHandler<HTMLParagraphElement>,
    className?: string
}

export default function Control({ children, onClick, className }: PropsWithChildren<ControlProps>) {
    return <span
        className={`px-4 py-2 flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 rounded shadow overflow-clip text-neutral-950 dark:text-neutral-50 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer ${className ? className : ""}`}
        onClick={onClick}
    >
        {children}
    </span>
}