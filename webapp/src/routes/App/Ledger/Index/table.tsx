import { Dispatch, SetStateAction } from "react"
import { groupBy, isNil } from "lodash"
import moment from "moment"

import Transaction from "@/types/Transaction"

import { accountContrastColor } from "@helpers/account/accountContrastColor"
import currencySourceAmountColor from "@helpers/transaction/currencySourceAmountColor"
import currencyAmountToHuman from "@helpers/currencyAmountToHuman"
import kindToHuman from "@helpers/account/kindToHuman"
import { cn } from "@/lib/utils"

import { Table, TableBody, TableCell, TableHead, TableRow } from "@components/ui/table"

interface TableProps {
    transactions: Transaction[]
    sortByFn: (a: Transaction, b: Transaction) => number
    groupByFn: (tr: Transaction) => string,
    withUpcoming: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    setTransaction: Dispatch<SetStateAction<Transaction | {}>>
}

export function TransactionTable({
    transactions, sortByFn, groupByFn, withUpcoming, setOpen, setTransaction
}: TableProps) {
    const upcomingDate = moment().endOf('day').toDate()

    return (
        <Table>
            <TableBody>
                {Object.entries(groupBy(transactions.sort(sortByFn), groupByFn))
                    .map(([date, tr]) => {
                        return {
                            date: moment(date).toDate(),
                            transactions: tr.sort((a, b) => Date.parse(a.updatedAt) - Date.parse(b.updatedAt))
                        }
                    })
                    .map(({ date, transactions }) => (
                        <Section
                            key={`transactions:${date.toISOString()}`}
                            date={date}
                            transactions={transactions}
                            withUpcoming={withUpcoming}
                            upcomingDate={upcomingDate}
                            setOpen={setOpen}
                            setTransaction={setTransaction}
                        />
                    ))}
            </TableBody>
        </Table>
    )
}

interface SectionProps {
    date: Date
    transactions: Transaction[]
    withUpcoming: boolean
    upcomingDate: Date
    setOpen: Dispatch<SetStateAction<boolean>>
    setTransaction: Dispatch<SetStateAction<Transaction | {}>>
}

function Section({ date, transactions, withUpcoming, upcomingDate, setOpen, setTransaction }: SectionProps) {
    const cellClassName = withUpcoming && date > upcomingDate ? "opacity-50" : ""

    return (
        <>
            <TableRow className="border-t dark:border-zinc-800">
                <TableHead colSpan={5}>
                    {date.toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    })}
                </TableHead>
            </TableRow>
            {
                transactions.map((transaction) => (
                    <TableRow
                        key={`transaction:${transaction.id}`}
                        className={cn("cursor-pointer", cellClassName)}
                        onClick={() => {
                            setTransaction(transaction)
                            setOpen(true)
                        }}
                    >
                        <TableCell
                            className="w-[5rem] text-center"
                            style={{
                                backgroundColor: transaction.source.color,
                                color: accountContrastColor(transaction.source.color)
                            }}
                        >
                            {kindToHuman(transaction.source.kind)}
                        </TableCell>
                        <TableCell className="w-[40dvw]">
                            {
                                isNil(transaction.source.parent)
                                    ? `${transaction.source.name}`
                                    : `${transaction.source.parent.name} (${transaction.source.name})`
                            }
                        </TableCell>
                        <TableCell
                            className="w-[5rem] text-center"
                            style={{
                                backgroundColor: transaction.target.color,
                                color: accountContrastColor(transaction.target.color)
                            }}
                        >
                            {kindToHuman(transaction.target.kind)}
                        </TableCell>
                        <TableCell className="w-[40dvw]">
                            <div className="flex flex-row gap-4">
                                <span>
                                    {
                                        isNil(transaction.target.parent)
                                            ? `${transaction.target.name}`
                                            : `${transaction.target.parent.name} (${transaction.target.name})`
                                    }
                                </span>
                            </div>
                        </TableCell>
                        <TableCell
                            className={cn(
                                "flex flex-row gap-4 justify-end font-semibold",
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
                        </TableCell>
                    </TableRow>
                ))
            }
        </>
    )
}