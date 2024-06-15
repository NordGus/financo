import { useMemo } from "react";

import Transaction from "@/types/Transaction";

interface Props {
    transaction: Transaction
}

export default function Base({
    transaction: {
        issuedAt,
        executedAt,
        source,
        target,
        sourceAmount,
        targetAmount
    }
}: Props) {
    const date = useMemo(() => {
        if (!executedAt) return new Date(Date.parse(issuedAt))
        else return new Date(Date.parse(executedAt))
    }, [issuedAt, executedAt])

    return (
        <div className="grid grid-rows-1 grid-cols-4 gap-2">
            <span>{source.name}</span>
            <span>{
                date.toLocaleDateString(
                    undefined,
                    {
                        weekday: "short",
                        year: "numeric",
                        month: "long",
                        day: "2-digit"
                    }
                )
            }</span>
            <span>{target.name}</span>
        </div>
    )
}