import { PropsWithChildren, ReactNode } from "react"
import { Link } from "react-router-dom"

import Throbber from "./Throbber"

export function Title({ text, grow = false }: { text: string, grow?: boolean }) {
    return <p className={`flex items-center px-2 ${grow ? "flex-grow" : ""}`}>
        {text}
    </p>
}

interface ActionLinkProps {
    text: string
    to: string
    grow?: boolean
}

export function ActionLink({ text, to, grow = false }: ActionLinkProps) {
    return <Link
        to={to}
        className={`flex items-center justify-center px-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 ${grow ? "flex-grow" : ""}`}
    >
        {text}
    </Link>
}

interface ActionButtonProps {
    text: string
    onClick: () => void
    active: boolean
    grow?: boolean
}

export function ActionButton({ text, onClick, active, grow = false }: ActionButtonProps) {
    return <p
        className={`flex items-center justify-center px-4 cursor-pointer ${active ? "bg-neutral-100 dark:bg-neutral-800" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"} ${grow ? "flex-grow" : ""}`}
        onClick={onClick}
    >
        {text}
    </p>
}

interface PanelProps {
    header: ReactNode,
    className?: string,
    loading?: boolean
    tabs?: ReactNode
}

export default function Panel(
    { header, className, tabs, children, loading = false }: PropsWithChildren<PanelProps>
) {
    return (
        <div
            className={`flex flex-col bg-neutral-50 dark:bg-neutral-900 divide-y dark:divide-neutral-800 border dark:border-neutral-800 rounded shadow overflow-clip text-neutral-950 dark:text-neutral-50 ${className}`}
        >
            <div
                className="flex justify-between items-stretch min-h-10 h-10 max-h-10 divide-x dark:divide-neutral-800"
            >
                {header}
            </div>
            {
                tabs && <div
                    className="flex justify-between items-stretch min-h-10 h-10 max-h-10 divide-x dark:divide-neutral-800"
                >
                    {tabs}
                </div>
            }
            <div
                className={`flex-grow overflow-y-auto divide-y dark:divide-neutral-800 ${(loading || !children) ? "flex justify-center items-center" : ""}`}
            >
                {
                    loading
                        ? <Throbber />
                        : children
                            ? children
                            : <span>No children</span>
                }
            </div>
        </div>
    )
}
