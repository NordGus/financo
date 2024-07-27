import { useQuery } from "@tanstack/react-query";
import { groupBy, isEmpty, isNil, ValueIteratee } from "lodash";

import Transaction from "@/types/Transaction";

import { staleTimeDefault } from "@queries/Client";
import { getPendingTransactions } from "@api/transactions";

import { cn } from "@/lib/utils";

import { Throbber } from "@components/Throbber";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@components/ui/table";
import moment from "moment";
import currencyAmountToHuman from "@helpers/currencyAmountToHuman";
import currencyAmountColor from "@helpers/currencyAmountColor";

export function PendingTransactions({
    accountID, className
}: { accountID: number, className?: string }) {
    const { data: transactions, isFetching, isError, error } = useQuery({
        queryKey: ["transactions", "pending", "account", accountID],
        queryFn: getPendingTransactions({ account: [accountID] }),
        staleTime: staleTimeDefault
    })

    if (isError) throw error
    if (isEmpty(transactions) || isNil(transactions)) return null

    return (
        <Card className={className}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                    <CardTitle>Pending Transactions</CardTitle>
                    <CardDescription>
                        Transactions with unknown Execution Date
                    </CardDescription>
                </div>
                {isFetching && <Throbber variant="small" />}
            </CardHeader>
            <CardContent>
                <TransactionsTable
                    accountID={accountID}
                    transactions={transactions}
                    sortByFn={(a, b) => Date.parse(a.issuedAt) - Date.parse(b.issuedAt)}
                    groupByFn={({ issuedAt }) => issuedAt}
                />
            </CardContent>
            <CardFooter>
                <CardDescription>
                    Please check that is no longer the case and update the transactions to reflect this
                </CardDescription>
            </CardFooter>
        </Card>
    )
}

function TransactionsTable({
    accountID, transactions, sortByFn, groupByFn
}: {
    accountID: number
    transactions: Transaction[]
    sortByFn: (a: Transaction, b: Transaction) => number
    groupByFn: (tr: Transaction) => string
}) {
    return Object.entries(groupBy(transactions.sort(sortByFn), groupByFn))
        .map(([date, tr]) => {
            return {
                date: moment(date, 'YYYY-MM-DD').toDate(),
                transactions: tr.sort((a, b) => Date.parse(a.updatedAt) - Date.parse(b.updatedAt))
            }
        })
        .map(({ date, transactions }) => (
            <div key={`transactions:pending:${date.toISOString()}`}>
                <h4 className="text-xl">
                    {date.toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    })}
                </h4>
                <Table>
                    <TableBody>
                        {transactions.map(({ id, source, target, sourceAmount, targetAmount }) => {
                            const external = source.id === accountID ? target : source
                            const account = source.id === accountID ? source : target
                            const amount = source.id === accountID ? sourceAmount : targetAmount

                            return <TableRow key={`transaction:${id}`}>
                                <TableCell>
                                    {
                                        isNil(external.parent)
                                            ? external.name
                                            : `${external.parent.name} (${external.name})`
                                    }
                                </TableCell>
                                <TableCell
                                    className={
                                        cn(
                                            "text-right",
                                            currencyAmountColor(account.id === source.id ? -1 : 1)
                                        )
                                    }
                                >
                                    {currencyAmountToHuman(amount, account.currency)}
                                </TableCell>
                            </TableRow>
                        })}
                    </TableBody>
                </Table>
            </div>
        ))
}