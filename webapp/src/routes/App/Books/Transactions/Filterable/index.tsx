import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { TransactionsFilters, getTransactions } from "@api/transactions";
import moment from "moment";
import { groupBy } from "lodash";

import Panel from "@components/Panel";
import Preview from "@components/transaction/Preview";
import Filters from "./Filters";

interface FilterableProps {
    className: string
}

function defaultFilters(): TransactionsFilters {
    return {
        executedFrom: moment().subtract({ months: 1 }).format('YYYY-MM-DD'),
        executedUntil: moment().format('YYYY-MM-DD')
    }
}

export default function Filterable({ className }: FilterableProps) {
    const [showFilters, setShowFilters] = useState(false)
    const [filters, setFilters] = useState<TransactionsFilters>(defaultFilters())
    const filtersMutation = useMutation({
        mutationFn: (filters: TransactionsFilters) => getTransactions(filters)()
    })

    useEffect(() => filtersMutation.mutate(filters), [filters])

    return (
        <Panel.WithFilters
            grow={true}
            className={className}
            header={<>
                <Panel.Components.Title grow={true} text="Transactions" />
                <Panel.Components.ActionButton
                    text={showFilters ? "Hide Filters" : "Show Filters"}
                    onClick={() => setShowFilters(!showFilters)}
                    active={showFilters}
                />
                <Panel.Components.ActionLink
                    text="Add"
                    to="/books/transactions/new"
                />
            </>}
            loading={filtersMutation.isPending}
            contents={
                (filtersMutation.data?.length === 0 || !filtersMutation.data)
                    ? null
                    : Object.entries(groupBy(filtersMutation.data.filter(
                        ({ executedAt }) => executedAt !== "null" && !!executedAt
                    ).
                        sort((a, b) => Date.parse(b.executedAt!) - Date.parse(a.executedAt!)),
                        ({ executedAt }) => executedAt!
                    )). // TODO: remove filter, and change return type
                        map(([date, transactions]) => {
                            return {
                                date: moment(date, 'YYYY-MM-DD').toDate(),
                                transactions: transactions.sort((a, b) => {
                                    return Date.parse(a.updatedAt) - Date.parse(b.updatedAt)
                                })
                            }
                        }).
                        map(({ date, transactions }) => (
                            <>
                                <h2
                                    className="px-2 py-1.5 text-2xl text-neutral-400 dark:text-neutral-600"
                                >
                                    {date.toLocaleDateString(undefined, {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                    })}
                                </h2>
                                {transactions.map((transaction) => (
                                    <Preview.WithNavigation
                                        key={`transaction:${transaction.id}`}
                                        transaction={transaction}
                                    />
                                ))}

                            </>
                        ))
            }
            filters={
                < Filters
                    filters={filters}
                    setFilters={setFilters}
                    onClear={() => setFilters(defaultFilters())}
                />
            }
            showFilters={showFilters}
        />
    )
}