import AccountType from "../../../../types/Account"

type Props = {
    account: AccountType
}

export default function Account({ account: { name, description, currency, children } }: Props) {
    return (
        <div
            className="
                px-4 py-1.5 min-h-24
                flex flex-col justify-center
                hover:bg-neutral-100 dark:hover:bg-neutral-800
                cursor-pointer
            "
        >
            <div className="flex justify-between items-start gap-1">
                <p className="text-lg flex-grow">{name}</p>
                <p className="text-sm text-neutral-400">{currency}</p>
            </div>
            <p className={`text-sm text-neutral-400 ${children.length !== 0 && 'mb-1.5'}`}>
                {description}
            </p>
            {children.length !== 0 && (<div className="flex gap-1">
                {
                    children.map(({ id, name }) => (
                        <span
                            key={`account:${id}`}
                            className="px-3 py-1 border rounded dark:border-neutral-800 text-sm"
                        >
                            {name}
                        </span>
                    ))
                }
            </div>)}
        </div>
    )
}
