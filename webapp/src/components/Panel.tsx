import { PropsWithChildren, ReactNode } from "react"

type Props = {
    header: ReactNode,
    className?: string
}

function Panel({ header, className, children }: PropsWithChildren<Props>) {
    return (
        <div
            className={`
                flex flex-col
                bg-neutral-50 dark:bg-neutral-900
                divide-y dark:divide-neutral-800
                border dark:border-neutral-800 rounded
                shadow overflow-clip
                ${className}
            `}
        >
            <div
                className="
                    flex justify-between items-stretch
                    min-h-12 h-12 max-h-12
                    divide-x dark:divide-neutral-800
                "
            >
                {header}
            </div>
            <div className="flex-grow overflow-y-auto divide-y dark:divide-neutral-800">
                {
                    children
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