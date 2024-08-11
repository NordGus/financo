import { useQuery } from "@tanstack/react-query";
import { groupBy, isEmpty, isNil } from "lodash";
import moment from "moment";

import Transaction from "@/types/Transaction";

import { transactionsQueries } from "@queries/transactions";

import Panel from "@components/Panel";
import Preview from "@components/transaction/Preview";

interface Props {
    className?: string
}

function sortAndGroup(transactions: Transaction[]) {
    return groupBy(
        transactions.sort((a, b) => Date.parse(a.executedAt!) - Date.parse(b.executedAt!)),
        ({ executedAt }) => executedAt
    );
}

export default function Upcoming({ className }: Props) {
    const query = useQuery(transactionsQueries.upcoming)

    return (
        <Panel.WithLoadingIndicator
            grow={true}
            className={className}
            header={<Panel.Components.Title grow={true} text="Upcoming Transactions" />}
            loading={query.isPending}
            contents={
                (isEmpty(query.data) || isNil(query.data))
                    ? null
                    : Object.entries(sortAndGroup(query.data)).
                        map(([date, transactions]) => {
                            return {
                                date: moment(date).toDate(),
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
                        There's no upcoming <span className="font-bold">Transactions</span> for the given filters
                    </p>
                </div>
            }
        />
    )
}