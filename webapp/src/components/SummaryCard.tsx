import { Currency } from "dinero.js"
import currencyAmountColor from "@helpers/currencyAmountColor"
import currencyAmountToHuman from "@helpers/currencyAmountToHuman"
import Throbber from "./Throbber"

interface Money {
    amount: number
    currency: Currency
}

interface Props {
    name: string
    summaries: Money[]
    loading: boolean
}

function SummaryCard({ name, summaries, loading }: Props) {
    return (
        <div
            className="flex items-center justify-between gap-1 px-2 py-1 h-10 border rounded dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 shadow"
        >
            <p className="flex-grow">{name}</p>
            {
                loading
                    ? <Throbber variant="small" />
                    : summaries.map(({ amount, currency }, idx) => (
                        <p key={`${name}:${idx}`} className={currencyAmountColor(amount)}>
                            {currencyAmountToHuman(amount, currency)}
                        </p>
                    ))
            }
        </div>
    )
}

export default SummaryCard