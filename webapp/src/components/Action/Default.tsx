import { PropsWithChildren } from "react";

import { ActionProps } from ".";

export default function Default({ children, onClick, className }: PropsWithChildren<ActionProps>) {
    return <span
        className={`flex items-center justify-center px-8 bg-zinc-50 dark:bg-zinc-950 border dark:border-zinc-800 rounded shadow overflow-clip text-zinc-950 dark:text-zinc-50  hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer ${className ? className : ""}`}
        onClick={onClick}
    >
        {children}
    </span>
}