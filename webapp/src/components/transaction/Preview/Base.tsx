import Transaction from "@/types/Transaction";
import Account, { Kind } from "@/types/Account";

import isDebtAccount from "@helpers/account/isDebtAccount";
import isCapitalAccount from "@helpers/account/isCapitalAccount";
import currencyAmountColor from "@helpers/currencyAmountColor";
import currencyAmountToHuman from "@helpers/currencyAmountToHuman";
import currencySourceAmountColor from "@helpers/transaction/currencySourceAmountColor";

interface Props {
    transaction: Transaction
}

function transactionLine(source: Account, target: Account): { top: Account, bottom: Account } {
    if (source.kind === Kind.ExternalIncome) return { top: source, bottom: target }
    if (isDebtAccount(source.kind) && isCapitalAccount(target.kind))
        return { top: source, bottom: target }

    return { top: target, bottom: source }
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
    const { top, bottom } = transactionLine(source, target)

    return (
        <div
            className="grid grid-rows-[min-content_min-content] grid-cols-[minmax(0,_1fr)_min-content] items-center gap-1"
        >
            <p className="text-xl">{top.name}</p>
            <p
                className={
                    `text-xl text-right ${currencySourceAmountColor(source.kind, target.kind)}`
                }
            >
                {currencyAmountToHuman(targetAmount, target.currency)}
            </p>
            <p className={`text-sm opacity-60 ${sameCurrency ? "col-span-2" : ""}`}>
                {bottom.name}
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