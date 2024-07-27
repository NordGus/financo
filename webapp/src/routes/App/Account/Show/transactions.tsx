import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { groupBy, isEmpty, isNil } from "lodash";
import { DateRange } from "react-day-picker";
import moment from "moment";

import Transaction from "@/types/Transaction";

import currencyAmountToHuman from "@helpers/currencyAmountToHuman";
import currencyAmountColor from "@helpers/currencyAmountColor";
import { cn } from "@/lib/utils";

import { staleTimeDefault } from "@queries/Client";
import { getPendingTransactions, getTransactions, ListFilters } from "@api/transactions";

import { Throbber } from "@components/Throbber";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@components/ui/table";
import { Button } from "@components/ui/button";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@components/ui/calendar";

export function PendingTransactions({
    account: { id: accountID }, className
}: { account: { id: number }, className?: string }) {
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
            <CardContent className="space-y-4">
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

export function UpcomingTransactions({
    account: { id: accountID }, className
}: { account: { id: number }, className?: string }) {
    const { data: transactions, isFetching, isError, error } = useQuery({
        queryKey: ["transactions", "upcoming", "account", accountID],
        queryFn: getTransactions({
            executedFrom: moment().format('YYYY-MM-DD'),
            executedUntil: moment().add({ month: 1 }).format('YYYY-MM-DD'),
            account: [accountID]
        }),
        staleTime: staleTimeDefault
    })

    if (isError) throw error
    if (isEmpty(transactions) || isNil(transactions)) return null

    return (
        <Card className={className}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                    <CardTitle>Upcoming Transactions</CardTitle>
                    <CardDescription>
                        Transactions that will become effective in the next month
                    </CardDescription>
                </div>
                {isFetching && <Throbber variant="small" />}
            </CardHeader>
            <CardContent className="space-y-4">
                <TransactionsTable
                    accountID={accountID}
                    transactions={transactions}
                    sortByFn={(a, b) => Date.parse(a.executedAt!) - Date.parse(b.executedAt!)}
                    groupByFn={({ executedAt }) => executedAt!}
                />
            </CardContent>
        </Card>
    )
}

export function TransactionHistory({
    account: { id: accountID, updatedAt }, className
}: { account: { id: number, updatedAt: string }, className?: string }) {
    const defaultFilters: () => ListFilters = () => {
        return {
            executedFrom: moment().startOf('month').toISOString(),
            executedUntil: moment().toISOString(),
            account: [accountID]
        }
    }
    const defaultDateRange: () => DateRange = () => {
        return {
            from: moment().startOf('month').toDate(),
            to: moment().toDate()
        }
    }

    const [filters, setFilters] = useState<ListFilters>(defaultFilters())
    const [date, setDate] = useState<DateRange | undefined>(defaultDateRange())
    const [clearable, setClearable] = useState(false)
    const { data: transactions, isPending, isError, error, mutate } = useMutation({
        mutationKey: ["transactions", "account", accountID],
        mutationFn: (filters: ListFilters) => getTransactions(filters)()
    })

    useEffect(() => mutate(filters), [filters, updatedAt])
    useEffect(() => {
        setFilters({
            account: [accountID],
            executedFrom: date?.from?.toISOString(),
            executedUntil: date?.to?.toISOString(),
        })
    }, [date])

    if (isError) throw error

    return (<>
        <div className={cn("flex justify-between", className)}>
            <Popover>
                <PopoverTrigger asChild={true}>
                    <Button
                        id="date"
                        variant="outline"
                        className={cn(
                            "min-w-[10rem] justify-start text-left font-normal",
                            !date && "text-zinc-500"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus={true}
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={(value) => {
                            setDate(value)
                            setClearable(true)
                        }}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
            {
                clearable && <Button
                    variant="link"
                    onClick={() => {
                        setDate(defaultDateRange())
                        setClearable(false)
                    }}
                >
                    Clear
                </Button>
            }
        </div>
        <Card className={className}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                    <CardTitle>Transactions</CardTitle>
                    <CardDescription>
                        Account's transaction history
                    </CardDescription>
                </div>
                {isPending && <Throbber variant="small" />}
            </CardHeader>
            <CardContent className="space-y-4">
                {
                    (isEmpty(transactions) || isNil(transactions))
                        ? <>
                            <p>This account doesn't have any transactions for the period</p>
                            <Button variant="outline" asChild={true}>
                                <Link to="/accounts/new">Create New Transaction</Link>
                            </Button>
                        </>
                        : <TransactionsTable
                            accountID={accountID}
                            transactions={transactions}
                            sortByFn={
                                (a, b) => Date.parse(b.executedAt!) - Date.parse(a.executedAt!)
                            }
                            groupByFn={({ executedAt }) => executedAt!}
                        />
                }
            </CardContent>
        </Card>
    </>)
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
                date: moment(date).toDate(),
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