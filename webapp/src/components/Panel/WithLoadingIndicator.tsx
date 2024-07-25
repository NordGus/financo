import { ReactNode } from "react"

import Throbber from "@components/Throbber"

import Base from "./Base"

interface WithLoadingIndicatorProps {
    header: ReactNode
    contents: ReactNode
    className?: string
    loading?: boolean
    noContentsMessage?: ReactNode | string
    grow?: boolean
}

export default function WithLoadingIndicator(
    {
        header,
        className,
        contents,
        noContentsMessage = "Empty",
        loading = false,
        grow = false
    }: WithLoadingIndicatorProps
) {
    return (
        <Base
            className={className}
            header={header}
        >
            <div
                className={`divide-y dark:divide-zinc-800 ${!contents ? "flex justify-center items-center" : ""} ${grow ? "flex-grow overflow-y-auto" : ""}`}
            >
                {
                    contents
                        ? contents
                        : loading
                            ? <></>
                            : <span>{noContentsMessage}</span>
                }
            </div>
            {loading && <div className="px-2 py-1 flex justify-end items-center gap-2">
                <Throbber variant="small" />
                <span className="text-sm">Fetching</span>
            </div>}
        </Base>
    )
}