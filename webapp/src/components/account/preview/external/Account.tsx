import AccountType from "../../../../types/Account"

type Props = {
    account: AccountType
}

export default function Account({ account: { name, description, currency } }: Props) {
    return (
        <div
            className="
                px-4 py-1.5 h-24
                flex flex-col justify-center
                hover:bg-neutral-100 dark:hover:bg-neutral-800
                cursor-pointer
            "
        >
            <div className="flex justify-between items-start gap-1">
                <p className="text-lg flex-grow">{name}</p>
                <p className="text-sm text-neutral-400">{currency}</p>
            </div>
            <p className="text-sm text-neutral-400">{description}</p>
        </div>
    )
}
