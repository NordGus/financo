import { PropsWithChildren } from "react";

import { ActionProps } from ".";

export default function Info({ children, onClick, className }: PropsWithChildren<ActionProps>) {
    return <span
        className={`flex items-center justify-center px-8 bg-blue-500 border border-blue-500 rounded shadow overflow-clip text-neutral-50 hover:bg-blue-600 cursor-pointer ${className ? className : ""}`}
        onClick={onClick}
    >
        {children}
    </span>
}