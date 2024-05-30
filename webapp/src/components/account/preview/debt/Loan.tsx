import { Link } from "react-router-dom"

import currencyAmountColor from "../../../../helpers/currencyAmountColor"
import currencyAmountToHuman from "../../../../helpers/currencyAmountToHuman"
import Account from "../../../../types/Account"

import Progress from "./Progress"

type Props = {
    account: Account
}

export default function Loan(
    {
        account: {
            id,
            kind,
            name,
            capital,
            balance,
            currency,
            description
        }
    }: Props
) {
    return (
        <Link
            to={`/accounts/${id}`}
            className="px-4 py-1.5 min-h-24 grid grid-cols-[minmax(0,_1fr)_min-content] gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors duration-200 ease-in-out"
        >
            <div className="flex flex-col justify-center">
                <p className="text-lg">{name}</p>
                <div className="flex justify-between items-baseline">
                    <p className={`text-lg ${currencyAmountColor(balance)}`}>
                        {currencyAmountToHuman(balance, currency)}
                    </p>
                    {
                        kind === "debt_personal" &&
                        (<p className="text-neutral-500">personal</p>)
                    }
                </div>
                <p className="text-sm text-neutral-400">{description}</p>
            </div>
            <Progress progress={Math.abs((balance + capital) / capital)} />
        </Link>
    )
}
