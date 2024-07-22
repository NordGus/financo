import { UseMutationResult } from "@tanstack/react-query";
import { groupBy, isEmpty, isNil } from "lodash";
import { Link } from "react-router-dom";
import moment from "moment";

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

function sortAndGroup(transactions: Transaction[]) {
    return groupBy(
        transactions.sort((a, b) => Date.parse(b.executedAt!) - Date.parse(a.executedAt!)),
        ({ executedAt }) => executedAt!
    );
}

export default function History({
    showFilters,
    setShowFilters,
    filters,
    className
}: FilterableProps) {
    const newTransactionPath = "/books/transactions/new"

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
                    to={newTransactionPath}
                />
            </>}
            loading={filters.isPending}
            contents={
                (isEmpty(filters.data) || isNil(filters.data))
                    ? null
                    : Object.entries(sortAndGroup(filters.data)).
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
            noContentsMessage={
                <div className="flex flex-col justify-center items-center gap-2">
                    <p>
                        There's no <span className="font-bold">Transactions</span> for the given filters
                    </p>
                    <Link to={newTransactionPath} className="text-sm underline">
                        You can add more
                    </Link>
                </div>
            }
        />
    )
}