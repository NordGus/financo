import { ReactNode, useState } from "react"

import Throbber from "@components/Throbber"

import Base from "./Base"
import { ActionButton } from "./components/ActionButton"

interface WithFiltersProps {
    header: ReactNode
    contents: ReactNode
    filters: ReactNode
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
        noContentsMessage = "Empty",
        loading = false,
        grow = false
    }: WithFiltersProps
) {
    const [showFilters, setShowFilters] = useState(false)

    return (
        <Base
            className={className}
            header={<>
                {header}
                <ActionButton
                    text={showFilters ? "Hide Filters" : "Show Filters"}
                    onClick={() => setShowFilters(!showFilters)}
                    active={showFilters}
                />
            </>}
        >
            <div hidden={showFilters}>
                {filters}
            </div>
            <div
                className={`divide-y dark:divide-neutral-800 ${!contents ? "flex justify-center items-center" : ""} ${grow ? "flex-grow overflow-y-auto" : ""}`}
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