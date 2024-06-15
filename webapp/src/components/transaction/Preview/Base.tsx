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
    const issueDate = useMemo(() => new Date(Date.parse(issuedAt)), [issuedAt])
    const executionDate = useMemo(() => {
        if (!executedAt) return undefined
        else return new Date(Date.parse(executedAt))
    }, [executedAt])

    return (
        <div className="grid grid-rows-1 grid-cols-4 gap-2">
            <span>{source.name}</span>
            <span>{
                issueDate.toLocaleDateString(
                    undefined,
                    {
                        weekday: "short",
                        year: "numeric",
                        month: "long",
                        day: "2-digit"
                    }
                )
            }</span>
            <span>{
                executionDate?.toLocaleDateString(
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