import { transactionsQueries } from "@queries/transactions";
import { useQuery } from "@tanstack/react-query";
import { groupBy } from "lodash";
import moment from "moment";

import Panel from "@components/Panel";
import Preview from "@components/transaction/Preview";

interface PendingProps {
    className: string
}

export default function Pending({ className }: PendingProps) {
    const query = useQuery(transactionsQueries.pending)

    return (
        <Panel.WithLoadingIndicator
            className={className}
            loading={query.isFetching}
            header={<Panel.Components.Title grow={true} text="Pending Transactions" />}
            contents={
                (query.data?.length === 0 || !query.data)
                    ? null
                    : Object.entries(
                        groupBy(query.data.
                            sort((a, b) => Date.parse(a.issuedAt) - Date.parse(b.issuedAt)),
                            ({ issuedAt }) => issuedAt
                        )).
                        map(([date, transactions]) => {
                            return { date: moment(date, 'YYYY-MM-DD').toDate(), transactions }
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
                                        key={`transaction:pending:${transaction.id}`}
                                        transaction={transaction}
                                    />
                                ))}

                            </div>
                        ))
            }
        />
    )
}