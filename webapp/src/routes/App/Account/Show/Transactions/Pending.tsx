import { groupBy } from "lodash"
import moment from "moment"

import Preview from "@components/transaction/Preview"
import Transaction from "@/types/Transaction"

export default function Pending({
    transactions: tr
}: {
    transactions: Transaction[]
}) {
    return Object.entries(
        groupBy(
            tr.sort((a, b) => Date.parse(b.issuedAt) - Date.parse(a.issuedAt)),
            ({ issuedAt }) => issuedAt
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
                        transaction={transaction}
                    />
                ))}

            </div>
        ))
}