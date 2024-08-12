import { useMutation } from "@tanstack/react-query";
import { groupBy, isEmpty, isNil } from "lodash";
import moment from "moment";

import Transaction from "@/types/Transaction";

import { getTransactions, ListFilters } from "@api/transactions";

import Panel from "@components/Panel";
import Preview from "@components/transaction/Preview";
import { Dispatch, SetStateAction, useEffect } from "react";

interface Props {
    filters: ListFilters
    setOpen: Dispatch<SetStateAction<boolean>>
    setTransaction: Dispatch<SetStateAction<Transaction | {}>>
    className?: string
}

function sortAndGroup(transactions: Transaction[]) {
    return groupBy(
        transactions.sort((a, b) => Date.parse(b.executedAt!) - Date.parse(a.executedAt!)),
        ({ executedAt }) => executedAt!
    );
}

export default function History({ filters, setOpen, setTransaction, className }: Props) {
    const { data, isPending, isError, error, mutate } = useMutation({
        mutationFn: (filters: ListFilters) => getTransactions(filters)()
    })

    useEffect(() => mutate(filters), [filters])

    if (isError) throw error

    return (
        <Panel.WithLoadingIndicator
            grow={true}
            className={className}
            header={<></>}
            loading={isPending}
            contents={
                (isEmpty(data) || isNil(data))
                    ? null
                    : Object.entries(sortAndGroup(data)).
                        map(([date, transactions]) => {
                            return {
                                date: moment(date, 'YYYY-MM-DD').toDate(),
                                transactions: transactions.sort((a, b) => {
                                    return Date.parse(a.updatedAt) - Date.parse(b.updatedAt)
                                })
                            }
                        }).
                        map(({ date, transactions }) => (
                            <div key={`history:${date.toISOString()}`}>
                                <h2
                                    className="px-2 py-1.5 text-2xl text-zinc-400 dark:text-zinc-600"
                                >
                                    {date.toLocaleDateString(undefined, {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                    })}
                                </h2>
                                {transactions.map((transaction) => (
                                    <Preview.ForList
                                        key={`transaction:${transaction.id}`}
                                        onClick={() => {
                                            setTransaction(transaction)
                                            setOpen(true)
                                        }}
                                        transaction={transaction}
                                        className="cursor-pointer"
                                    />
                                ))}

                            </div>
                        ))
            }
            noContentsMessage={
                <div className="flex flex-col justify-center items-center gap-2">
                    <p>
                        There's no <span className="font-bold">Transactions</span> for the given filters
                    </p>
                </div>
            }
        />
    )
}