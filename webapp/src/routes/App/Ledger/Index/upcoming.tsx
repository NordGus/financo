import { Dispatch, SetStateAction, useEffect } from "react"
import { useMutation, UseMutationResult } from "@tanstack/react-query"
import { groupBy, isEmpty, isNil } from "lodash"
import moment from "moment"

import Transaction from "@/types/Transaction"

import { getTransactions, ListFilters } from "@api/transactions"

import { accountContrastColor } from "@helpers/account/accountContrastColor"
import kindToHuman from "@helpers/account/kindToHuman"
import currencyAmountToHuman from "@helpers/currencyAmountToHuman"
import currencySourceAmountColor from "@helpers/transaction/currencySourceAmountColor"
import { cn } from "@/lib/utils"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table"
import { CardContent, CardFooter } from "@components/ui/card"
import { Throbber } from "@components/Throbber"

interface Props {
    mutation: UseMutationResult<Transaction[], Error, ListFilters, unknown>
    setOpen: Dispatch<SetStateAction<boolean>>
    setTransaction: Dispatch<SetStateAction<Transaction | {}>>
}

function sortAndGroup(transactions: Transaction[]) {
    return groupBy(
        transactions.sort((a, b) => Date.parse(b.executedAt!) - Date.parse(a.executedAt!)),
        ({ executedAt }) => executedAt!
    );
}

export function TransactionsUpcoming({
    mutation: { data, isPending, isError, error }, setOpen, setTransaction
}: Props) {
    if (isError) throw error

    if (isPending) return (
        <>
            <CardContent className="flex flex-row gap-4 justify-center items-center">
                <Throbber /> <p>Fetching</p>
            </CardContent>
            <CardFooter></CardFooter>
        </>
    )

    if (isEmpty(data) || isNil(data)) return (
        <>
            <CardContent className="flex flex-row gap-4 justify-center items-center">
                <p>There's no <span className="font-bold">Transactions</span> for the given filters</p>
            </CardContent>
            <CardFooter></CardFooter>
        </>
    )

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[20dvw]">Executed At</TableHead>
                    <TableHead className="w-[35dvw]">From</TableHead>
                    <TableHead className="w-[35dvw]">To</TableHead>
                    <TableHead className="w-[10dvw]">Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    Object.entries(sortAndGroup(data))
                        .map(([date, transactions]) => ({
                            date: moment(date, 'YYYY-MM-DD').toDate(),
                            transactions: transactions.sort((a, b) => {
                                return Date.parse(a.updatedAt) - Date.parse(b.updatedAt)
                            })
                        }))
                        .map(({ date, transactions }) => (
                            <SectionRow
                                key={date.toISOString()}
                                date={date}
                                transactions={transactions}
                                setOpen={setOpen}
                                setTransaction={setTransaction}
                            />
                        ))
                }
            </TableBody>
        </Table>
    )
}

interface SectionProps {
    date: Date
    transactions: Transaction[]
    setOpen: Dispatch<SetStateAction<boolean>>
    setTransaction: Dispatch<SetStateAction<Transaction | {}>>
}

function SectionRow({ date, transactions, setOpen, setTransaction }: SectionProps) {
    return (
        <>
            <TableRow>
                <TableCell rowSpan={transactions.length + 1}>
                    {date.toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    })}
                </TableCell>
            </TableRow>
            {
                transactions.map((transaction) => (

                    <TableRow
                        key={`transaction:${transaction.id}`}
                        className="cursor-pointer"
                        onClick={() => {
                            setTransaction(transaction)
                            setOpen(true)
                        }}
                    >
                        <TableCell>
                            <div className="flex flex-row gap-4">
                                <span
                                    className="px-1 py-0.5 rounded"
                                    style={{
                                        backgroundColor: transaction.source.color,
                                        color: accountContrastColor(transaction.source.color)
                                    }}
                                >
                                    {kindToHuman(transaction.source.kind)}
                                </span>
                                <span>
                                    {
                                        isNil(transaction.source.parent)
                                            ? `${transaction.source.name}`
                                            : `${transaction.source.parent.name} (${transaction.source.name})`
                                    }
                                </span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-row gap-4">
                                <span
                                    className="px-1 py-0.5 rounded"
                                    style={{
                                        backgroundColor: transaction.target.color,
                                        color: accountContrastColor(transaction.target.color)
                                    }}
                                >
                                    {kindToHuman(transaction.target.kind)}
                                </span>
                                <span>
                                    {
                                        isNil(transaction.target.parent)
                                            ? `${transaction.target.name}`
                                            : `${transaction.target.parent.name} (${transaction.target.name})`
                                    }
                                </span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div
                                className={cn(
                                    "flex flex-row gap-4 justify-between",
                                    currencySourceAmountColor(transaction.source.kind, transaction.target.kind)
                                )}
                            >
                                <span>
                                    {currencyAmountToHuman(transaction.sourceAmount, transaction.source.currency)}
                                </span>
                                {
                                    transaction.target.currency !== transaction.source.currency && (
                                        <span>
                                            {currencyAmountToHuman(
                                                transaction.targetAmount, transaction.target.currency
                                            )}
                                        </span>
                                    )
                                }
                            </div>
                        </TableCell>
                    </TableRow>
                ))
            }
        </>
    )
}