import { PropsWithChildren, ReactNode } from "react"

import Throbber from "./Throbber"

interface Props {
    header: ReactNode,
    className?: string,
    loading?: boolean
}

function Panel({ header, className, loading = false, children }: PropsWithChildren<Props>) {
    return (
        <div
            className={`flex flex-col bg-neutral-50 dark:bg-neutral-900 divide-y dark:divide-neutral-800 border dark:border-neutral-800 rounded shadow overflow-clip ${className}`}
        >
            <div
                className="flex justify-between items-stretch min-h-10 h-10 max-h-10 divide-x dark:divide-neutral-800"
            >
                {header}
            </div>
            <div className="flex-grow overflow-y-auto divide-y dark:divide-neutral-800">
                {
                    loading
                        ? (<span className="flex h-full justify-center items-center">
                            <Throbber />
                        </span>)
                        : children
                            ? children
                            : (
                                <div className="h-full flex flex-col justify-center items-center">
                                    <span>No children</span>
                                </div>
                            )
                }
            </div>
        </div>
    )
}

export default Panel