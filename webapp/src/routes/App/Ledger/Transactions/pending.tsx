import { transactionsQueries } from "@queries/transactions";
import { useQuery } from "@tanstack/react-query";
import { groupBy, isEmpty, isNil } from "lodash";
import moment from "moment";

import Transaction from "@/types/Transaction";

import Panel from "@components/Panel";
import Preview from "@components/transaction/Preview";
import { ListFilters } from "@api/transactions";
import { Dispatch, SetStateAction } from "react";

interface Props {
    filters: ListFilters
    setOpen: Dispatch<SetStateAction<boolean>>
    setTransaction: Dispatch<SetStateAction<Transaction | {}>>
    className?: string
}

function sortAndGroup(transactions: Transaction[]) {
    return groupBy(
        transactions.sort((a, b) => Date.parse(a.issuedAt) - Date.parse(b.issuedAt)),
        ({ issuedAt }) => issuedAt
    );
}

export default function Pending({ setOpen, setTransaction, className }: Props) {
    const query = useQuery(transactionsQueries.pending)

    return (
        <Panel.WithLoadingIndicator
            grow={true}
            className={className}
            loading={query.isFetching}
            header={<Panel.Components.Title grow={true} text="Pending Transactions" />}
            contents={
                (isEmpty(query.data) || isNil(query.data))
                    ? null
                    : Object.entries(sortAndGroup(query.data)).
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
                                        key={`transaction:pending:${transaction.id}`}
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
                        There's no <span className="font-bold">Transactions</span> pending in the system
                    </p>
                </div>
            }
        />
    )
}