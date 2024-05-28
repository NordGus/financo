import { Currency } from "dinero.js"
import currencyAmountColor from "../helpers/currencyAmountColor"
import currencyAmountToHuman from "../helpers/currencyAmountToHuman"

type Money = {
    amount: number
    currency: Currency
}

type Props = {
    name: string,
    summaries: Money[]
}

function SummaryCard({ name, summaries }: Props) {
    return (
        <div
            className="
                flex items-center justify-between gap-1
                px-4 py-1.5 h-12
                border rounded dark:border-neutral-800
                bg-neutral-50 dark:bg-neutral-900
                shadow
            "
        >
            <p className="flex-grow">{name}</p>
            {summaries.map(({ amount, currency }, idx) => (
                <p key={`${name.toLowerCase()}:${idx}`} className={currencyAmountColor(amount)}>
                    {currencyAmountToHuman(amount, currency)}
                </p>
            ))}
        </div>
    )
}

export default SummaryCard