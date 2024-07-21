import { ReactNode } from "react"

import Throbber from "@components/Throbber"

import { ActionButton } from "./components/ActionButton"
import Base from "./Base"

interface WithTabsProps {
    header: ReactNode
    tabs: TabProps[]
    contents: ReactNode
    className?: string
    loading?: boolean
    noContentsMessage?: ReactNode | string
    grow?: boolean
}

interface TabProps {
    key: string
    text: string
    active: boolean
    onClick: () => void
}

export default function WithTabs(
    {
        header,
        className,
        tabs,
        contents,
        noContentsMessage = "Empty",
        loading = false,
        grow = false
    }: WithTabsProps
) {
    return (
        <Base
            className={className}
            header={header}
        >
            <div
                className="flex justify-between items-stretch min-h-10 h-10 max-h-10"
            >
                {tabs.map(({ key, text, onClick, active }) => <ActionButton
                    key={key}
                    text={text}
                    onClick={onClick}
                    active={active}
                    grow={true}
                />)}
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
            {loading && <div className="px-2 py-1 flex justify-end items-center gap-2">
                <Throbber variant="small" />
                <span className="text-sm">Fetching</span>
            </div>}
        </Base>
    )
}