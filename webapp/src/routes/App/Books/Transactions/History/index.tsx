import { UseMutationResult } from "@tanstack/react-query";
import moment from "moment";
import { groupBy } from "lodash";

import Transaction from "@/types/Transaction";

import { ListFilters } from "@api/transactions";

import Panel from "@components/Panel";
import Preview from "@components/transaction/Preview";

interface FilterableProps {
    showFilters: boolean,
    setShowFilters: React.Dispatch<React.SetStateAction<boolean>>,
    filters: UseMutationResult<Transaction[], Error, ListFilters, unknown>,
    className?: string
}

export default function History({
    showFilters,
    setShowFilters,
    filters,
    className
}: FilterableProps) {
    return (
        <Panel.WithLoadingIndicator
            grow={true}
            className={className}
            header={<>
                <Panel.Components.Title grow={true} text="Transactions" />
                <Panel.Components.ActionButton
                    text={"Filter"}
                    onClick={() => setShowFilters(!showFilters)}
                    active={showFilters}
                />
                <Panel.Components.ActionLink
                    text="Add"
                    to="/books/transactions/new"
                />
            </>}
            loading={filters.isPending}
            contents={
                (filters.data?.length === 0 || !filters.data)
                    ? null
                    : Object.entries(
                        groupBy(filters.data.
                            sort((a, b) => Date.parse(b.executedAt!) - Date.parse(a.executedAt!)),
                            ({ executedAt }) => executedAt!
                        )).
                        map(([date, transactions]) => {
                            return {
                                date: moment(date, 'YYYY-MM-DD').toDate(),
                                transactions: transactions.sort((a, b) => {
                                    return Date.parse(a.updatedAt) - Date.parse(b.updatedAt)
                                })
                            }
                        }).
                        map(({ date, transactions }) => (
                            <div>
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

                            </div>
                        ))
            }
        />
    )
}