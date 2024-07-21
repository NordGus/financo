import { PropsWithChildren } from "react";

import { ActionProps } from ".";

export default function Default({ children, onClick, className }: PropsWithChildren<ActionProps>) {
    return <span
        className={`flex items-center justify-center px-8 bg-neutral-50 dark:bg-neutral-900 border dark:border-neutral-800 rounded shadow overflow-clip text-neutral-950 dark:text-neutral-50  hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer ${className ? className : ""}`}
        onClick={onClick}
    >
        {children}
    </span>
}