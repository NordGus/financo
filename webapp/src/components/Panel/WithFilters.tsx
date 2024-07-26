import { ReactNode } from "react"

import { Throbber } from "@components/Throbber"

import Base from "./Base"

interface WithFiltersProps {
    header: ReactNode
    contents: ReactNode
    filters: ReactNode
    showFilters: boolean
    className?: string
    loading?: boolean
    noContentsMessage?: ReactNode | string
    grow?: boolean
}

export default function WithFilters(
    {
        header,
        className,
        contents,
        filters,
        showFilters,
        noContentsMessage = "Empty",
        loading = false,
        grow = false
    }: WithFiltersProps
) {
    return (
        <Base
            className={className}
            header={header}
        >
            <div hidden={!showFilters}>
                {filters}
            </div>
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
            {
                loading && <div className="px-2 py-1 flex justify-end items-center gap-2">
                    <Throbber variant="small" />
                    <span className="text-sm">Fetching</span>
                </div>
            }
        </Base >
    )
}