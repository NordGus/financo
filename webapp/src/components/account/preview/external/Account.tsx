import { Link } from "react-router-dom"
import AccountType from "../../../../types/Account"

type Props = {
    account: AccountType
}

export default function Account({ account: { name, description, currency, children } }: Props) {
    return (
        <details
            className="
                flex flex-col justify-center
                divide-y dark:divide-neutral-800
                [&_svg]:open:-rotate-180
            "
        >
            <summary
                className="
                    grid grid-cols-[minmax(0,_1fr)_min-content] gap-1 h-24
                    hover:bg-neutral-100 dark:hover:bg-neutral-800
                "
            >
                <Link
                    to={'/books'}
                    className={`
                        flex flex-col justify-center
                        pl-4 py-1.5 ${children.length === 0 && "col-span-2"}
                    `}
                >
                    <p className="text-lg">{name}</p>
                    <p className="text-sm text-neutral-400">{currency}</p>
                    <p className="text-sm text-neutral-400">
                        {description}
                    </p>
                </Link>
                {children.length !== 0 && (
                    <div className="px-4 py-1.5 flex justify-center items-center">
                        <span
                            className="
                                p-1
                                border rounded dark:border-neutral-50 border-neutral-950
                                cursor-pointer
                            "
                        >
                            <svg
                                className="rotate-0 transform transition-all duration-200"
                                fill="none"
                                height="20"
                                width="20"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                viewBox="0 0 24 24"
                            >
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </div>
                )}
            </summary>
            {children.length !== 0 && children.map(({ id, name, description, currency }) => (
                <div
                    key={`account:${id}`}
                    className="
                        flex flex-col justify-center
                        pl-8 pr-4 py-1.5 h-24
                        hover:bg-neutral-100 dark:hover:bg-neutral-800
                    "
                >
                    <p className="text-lg">{name}</p>
                    <p className="text-sm text-neutral-400">{currency}</p>
                    <p className="text-sm text-neutral-400">{description}</p>
                </div>
            ))}
        </details>
    )
}
