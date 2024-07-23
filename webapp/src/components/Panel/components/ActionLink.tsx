import React from "react"
import { Link } from "react-router-dom"

interface ActionLinkProps {
    text: string | React.ReactNode
    to: string
    grow?: boolean
}

export function ActionLink({ text, to, grow = false }: ActionLinkProps) {
    return <Link
        to={to}
        className={`flex items-center justify-center px-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 ${grow ? "flex-grow" : ""}`}
    >
        {text}
    </Link>
}