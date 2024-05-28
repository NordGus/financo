import currencyAmountColor from "../../../../helpers/currencyAmountColor"
import currencyAmountToHuman from "../../../../helpers/currencyAmountToHuman"
import AccountType from "../../../../types/Account"

type Props = {
    account: AccountType
}

export default function Account({ account: { name, description, balance, currency } }: Props) {
    return (
        <div
            className="
                px-4 py-1.5 h-24
                flex flex-col justify-center
                hover:bg-neutral-100 dark:hover:bg-neutral-800
                cursor-pointer
            "
        >
            <p className="text-lg col-span-2">{name}</p>
            <p className={`text-lg ${currencyAmountColor(balance)}`}>
                {currencyAmountToHuman(balance, currency)}
            </p>
            <p className="text-sm text-neutral-400 col-span-2">{description}</p>
        </div>
    )
}