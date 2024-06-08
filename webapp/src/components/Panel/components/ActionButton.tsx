interface ActionButtonProps {
    text: string
    onClick: () => void
    active: boolean
    grow?: boolean
}

export function ActionButton({ text, onClick, active, grow = false }: ActionButtonProps) {
    return <p
        className={`flex items-center justify-center px-4 cursor-pointer select-none ${active ? "bg-neutral-100 dark:bg-neutral-800" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"} ${grow ? "flex-grow" : ""}`}
        onClick={onClick}
    >
        {text}
    </p>
}