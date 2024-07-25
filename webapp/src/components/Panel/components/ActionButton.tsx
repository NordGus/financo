interface ActionButtonProps {
    text: string | React.ReactNode
    onClick: React.MouseEventHandler<HTMLSpanElement>,
    active: boolean
    grow?: boolean
}

export function ActionButton({ text, onClick, active, grow = false }: ActionButtonProps) {
    return <span
        className={`flex items-center justify-center px-2 cursor-pointer select-none ${active ? "bg-zinc-100 dark:bg-zinc-800" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"} ${grow ? "flex-grow" : ""}`}
        onClick={onClick}
    >
        {text}
    </span>
}