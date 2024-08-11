import { UseMutationResult } from "@tanstack/react-query";
import { groupBy, isEmpty, isNil } from "lodash";
import { Link } from "react-router-dom";
import moment from "moment";

import Transaction from "@/types/Transaction";

import { ListFilters } from "@api/transactions";

import Panel from "@components/Panel";
import Preview from "@components/transaction/Preview";

interface Props {
    showFilters: boolean,
    setShowFilters: React.Dispatch<React.SetStateAction<boolean>>,
    transactions: UseMutationResult<Transaction[], Error, ListFilters, unknown>,
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
    transactions: tr,
    className
}: Props) {
    const newTransactionPath = "/books/transactions/new"

    return (
        <Panel.WithLoadingIndicator
            grow={true}
            className={className}
            header={<>
                <Panel.Components.Title grow={true} text="Transactions" />
                <Panel.Components.ActionButton
                    text={
                        <span className="material-symbols-rounded">filter_list</span>
                    }
                    onClick={() => setShowFilters(!showFilters)}
                    active={showFilters}
                />
                <Panel.Components.ActionLink
                    text={
                        <span className="material-symbols-rounded">add</span>
                    }
                    to={newTransactionPath}
                />
            </>}
            loading={tr.isPending}
            contents={
                (isEmpty(tr.data) || isNil(tr.data))
                    ? null
                    : Object.entries(sortAndGroup(tr.data)).
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