import currencyAmountToHuman from "@helpers/currencyAmountToHuman";

import Transaction from "@/types/Transaction";

interface Props {
    transaction: Transaction
}

export default function Base({
    transaction: {
        source,
        target,
        sourceAmount,
        targetAmount
    }
}: Props) {
    const sameCurrency = source.currency === target.currency

    return (
        <div className="grid grid-rows-1 grid-cols-4 gap-2">
            <span>{source.name}</span>
            <span className={`${sameCurrency ? "col-span-2" : ""}`}>
                {currencyAmountToHuman(sourceAmount, source.currency)}
            </span>
            {!sameCurrency && <span>{currencyAmountToHuman(targetAmount, target.currency)}</span>}
            <span>{target.name}</span>
        </div>
    )
}