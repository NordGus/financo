import { PropsWithChildren } from "react"

type Props = {
    title: string,
    className?: string
}

function Panel({ title, className, children }: PropsWithChildren<Props>) {
    return (
        <div
            className={`
                flex flex-col
                h-full
                bg-neutral-50 dark:bg-neutral-900
                divide-y dark:divide-neutral-800
                border dark:border-neutral-800 rounded-lg
                shadow
                ${className}
            `}
        >
            <div className="h-14 flex justify-between items-stretch">
                <h2 className="text-lg px-4 py-1.5 flex items-center">{title}</h2>
            </div>
            <div className="flex-grow overflow-y-auto divide-y">
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