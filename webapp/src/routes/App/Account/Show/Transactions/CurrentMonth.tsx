import { useQuery } from "@tanstack/react-query"
import { groupBy, isEmpty, isNil } from "lodash"
import moment from "moment"

import Detailed from "@/types/Account"

import { monthsTransactionsForAccountQuery } from "@queries/transactions"

import Panel from "@components/Panel"
import Preview from "@components/transaction/Preview"

interface Props {
    account: Detailed
    className?: string
}

export default function CurrentMonth({ account, className }: Props) {
    const query = useQuery(monthsTransactionsForAccountQuery(account.id))

    return (
        <Panel.WithLoadingIndicator
            grow={true}
            className={className}
            header={<Panel.Components.Title grow={true} text="This Month's Transactions" />}
            loading={query.isFetching}
            contents={
                (isEmpty(query.data) || isNil(query.data))
                    ? null
                    : Object.entries(
                        groupBy(query.data.
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
                            <div key={`transactions:${date.toISOString()}`}>
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
                                    <Preview.ForList
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
                        <span className="font-bold">{account.name}</span>
                        doesn't have
                        <span className="font-bold">Transactions</span>
                        for this month
                    </p>
                </div>
            }
        />
    )
}