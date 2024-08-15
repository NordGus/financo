import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, UseMutationResult, useSuspenseQuery, UseSuspenseQueryResult } from "@tanstack/react-query";
import { groupBy, isEmpty, isEqual, isNil } from "lodash";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import moment from "moment";

import Detailed from "@/types/Account"
import Transaction from "@/types/Transaction";

import currencyAmountToHuman from "@helpers/currencyAmountToHuman";
import currencyAmountColor from "@helpers/currencyAmountColor";
import { cn } from "@/lib/utils";

import { getTransactions, ListFilters } from "@api/transactions";
import { pendingTransactionsQueryOptions, upcomingTransactionsQueryOptions } from "@queries/accounts";

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
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";
import { Calendar } from "@components/ui/calendar";

interface Props {
    account: Detailed
    className?: string
}

function defaultHistoryFilters(account: Detailed): ListFilters {
    return {
        executedFrom: moment().startOf('month').startOf('day').toISOString(),
        executedUntil: moment().endOf('day').toISOString(),
        account: [account.id]
    }
}

// [ ] make endpoints specialized to retrieved transactions for a given account
export function Transactions({ account, className }: Props) {
    const [filters, setFilters] = useState<ListFilters>(defaultHistoryFilters(account))

    const pendingQuery = useSuspenseQuery(pendingTransactionsQueryOptions(account.id))
    const upcomingQuery = useSuspenseQuery(upcomingTransactionsQueryOptions(account.id))
    const historyMutation = useMutation({
        mutationKey: ["transactions", "account", account.id],
        mutationFn: (filters: ListFilters) => getTransactions(filters)()
    })

    useEffect(() => historyMutation.mutate(filters), [filters, account.updatedAt])

    return (
        <div className={cn("", className)}>
            <Card>
                <CardHeader>
                    <CardTitle>Transactions</CardTitle>
                </CardHeader>
            </Card>
        </div>
    )
}

export function PendingTransactions({
    account: { id: accountID },
    query: { data: transactions, isFetching, isError, error },
    className
}: {
    account: { id: number },
    query: UseSuspenseQueryResult<Transaction[], Error>,
    className?: string,
}) {
    if (isError) throw error

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
                {
                    isEmpty(transactions) || isNil(transactions)
                        ? <>
                            <p>There aren't any pending transactions</p>
                        </>
                        : <TransactionsTable
                            accountID={accountID}
                            transactions={transactions}
                            sortByFn={(a, b) => Date.parse(a.issuedAt) - Date.parse(b.issuedAt)}
                            groupByFn={({ issuedAt }) => issuedAt}
                            withUpcoming={false}
                        />
                }
            </CardContent>
            {
                !isEmpty(transactions) && !isNil(transactions) && <CardFooter>
                    <CardDescription>
                        Please check that is no longer the case and update the transactions to reflect this
                    </CardDescription>
                </CardFooter>
            }
        </Card>
    )
}

export function UpcomingTransactions({
    account: { id: accountID },
    query: { data: transactions, isFetching, isError, error },
    className
}: {
    account: { id: number },
    query: UseSuspenseQueryResult<Transaction[], Error>,
    className?: string,
}) {
    if (isError) throw error

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
                {
                    isEmpty(transactions) || isNil(transactions)
                        ? <>
                            <p>There aren't any upcoming transactions</p>
                        </>
                        : <TransactionsTable
                            accountID={accountID}
                            transactions={transactions}
                            sortByFn={
                                (a, b) => Date.parse(a.executedAt!) - Date.parse(b.executedAt!)
                            }
                            groupByFn={({ executedAt }) => executedAt!}
                            withUpcoming={false}
                        />
                }
            </CardContent>
        </Card>
    )
}

export function TransactionHistory({
    account: { id: accountID },
    mutation: { data: transactions, isPending, isError, error },
    defaultFilters,
    filtersState: [filters, setFilters],
    className
}: {
    account: { id: number },
    mutation: UseMutationResult<Transaction[], Error, ListFilters, unknown>,
    defaultFilters: () => ListFilters,
    filtersState: [ListFilters, Dispatch<SetStateAction<ListFilters>>]
    className?: string,
}) {
    const [date, setDate] = useState<DateRange | undefined>({
        from: moment(filters.executedFrom).toDate(),
        to: moment(filters.executedUntil).toDate()
    })
    const [clearable, setClearable] = useState(
        !isEqual(
            { from: date?.from?.toISOString(), to: date?.to?.toISOString() },
            { from: defaultFilters().executedFrom, to: defaultFilters().executedUntil }
        )
    )

    if (isError) throw error

    return (<>
        <div className={cn("flex justify-between")}>
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
                            setFilters({
                                account: [accountID],
                                executedFrom: value?.from?.toISOString(),
                                executedUntil: value?.to?.toISOString(),
                            })
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
                        setDate({
                            from: moment(defaultFilters().executedFrom).toDate(),
                            to: moment(defaultFilters().executedUntil).toDate()
                        })
                        setFilters(defaultFilters())
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
                            withUpcoming={true}
                        />
                }
            </CardContent>
        </Card>
    </>)
}

function TransactionsTable({
    accountID, transactions, sortByFn, groupByFn, withUpcoming
}: {
    accountID: number
    transactions: Transaction[]
    sortByFn: (a: Transaction, b: Transaction) => number
    groupByFn: (tr: Transaction) => string,
    withUpcoming: boolean
}) {
    const upcomingDate = moment().endOf('day').toDate()

    return Object.entries(groupBy(transactions.sort(sortByFn), groupByFn))
        .map(([date, tr]) => {
            return {
                date: moment(date).toDate(),
                transactions: tr.sort((a, b) => Date.parse(a.updatedAt) - Date.parse(b.updatedAt))
            }
        })
        .map(({ date, transactions }) => (
            <div
                key={`transactions:pending:${date.toISOString()}`}
                className={cn("", withUpcoming && date > upcomingDate && "opacity-50")}
            >
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