import currencyAmountToHuman from "@helpers/currencyAmountToHuman";

import Transaction from "@/types/Transaction";
import currencyAmountColor from "@helpers/currencyAmountColor";
import currencySourceAmountColor from "@helpers/transaction/currencySourceAmountColor";

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
        <div className="grid grid-rows-2 grid-cols-[minmax(0,_1fr)_min-content] items-center gap-1">
            <p className="text-lg">{target.name}</p>
            <p className={`text-lg text-right ${currencySourceAmountColor(source.kind, target.kind)}`}>
                {currencyAmountToHuman(targetAmount, target.currency)}
            </p>
            <p className={`text-sm ${sameCurrency ? "col-span-2" : ""}`}>
                Source: {source.name}
            </p>
            {
                !sameCurrency &&
                <p className={`text-right opacity-60 ${currencyAmountColor(0)}`}>
                    {currencyAmountToHuman(sourceAmount, source.currency)}
                </p>
            }
        </div>
    )
}