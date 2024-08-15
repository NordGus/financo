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
import kindToHuman from "@helpers/account/kindToHuman";
import { cn } from "@/lib/utils";

import {
    getPendingTransactions,
    getTransactions,
    ListFilters,
    PendingFilters
} from "@api/transactions";

import { Throbber } from "@components/Throbber";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@components/ui/table";
import { Button } from "@components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";
import { Calendar } from "@components/ui/calendar";
import { Accordion } from "@components/ui/accordion";
import { accountContrastColor } from "@helpers/account/accountContrastColor";

interface Props {
    account: Detailed
    className?: string
}

function historyFilters(account: Detailed, filters: ListFilters): ListFilters {
    return {
        executedFrom: filters.executedFrom || moment().startOf('month').startOf('day').toISOString(),
        executedUntil: filters.executedUntil || moment().endOf('day').toISOString(),
        account: [account.id, ...(filters.account || [])]
    }
}

function upcomingFilters(account: Detailed, filters: ListFilters): ListFilters {
    return {
        executedFrom: moment().toISOString(),
        executedUntil: moment().add({ month: 1 }).toISOString(),
        account: [account.id, ...(filters.account || [])]
    }
}

function pendingFilters(account: Detailed, filters: ListFilters): PendingFilters {
    return {
        account: [account.id, ...(filters.account || [])]
    }
}

// [ ] make endpoints specialized to retrieved transactions for a given account
export function Transactions({ account, className }: Props) {
    const [filters, setFilters] = useState<ListFilters>(historyFilters(account, {}))
    const [date, setDate] = useState<DateRange>({
        from: moment(filters.executedFrom).toDate(),
        to: moment(filters.executedUntil).toDate()
    })
    const [clearable, setClearable] = useState(
        !isEqual(
            { from: date.from?.toISOString(), to: date.to?.toISOString() },
            { from: historyFilters(account, {}).executedFrom, to: historyFilters(account, {}).executedUntil }
        )
    )

    const pendingMutation = useMutation({
        mutationKey: ["transactions", "pending", "account", account.id],
        mutationFn: (filters: ListFilters) => getPendingTransactions(pendingFilters(account, filters))()
    })
    const upcomingMutation = useMutation({
        mutationKey: ["transactions", "upcoming", "account", account.id],
        mutationFn: (filters: ListFilters) => getTransactions(upcomingFilters(account, filters))()
    })
    const historyMutation = useMutation({
        mutationKey: ["transactions", "account", account.id],
        mutationFn: (filters: ListFilters) => getTransactions(filters)()
    })

    useEffect(() => {
        historyMutation.mutate(historyFilters(account, filters))
        pendingMutation.mutate(pendingFilters(account, filters))
        upcomingMutation.mutate(upcomingFilters(account, filters))
    }, [filters, account.updatedAt])

    return (
        <div className={cn("flex flex-col gap-4", className)}>
            <div className={cn("flex justify-end gap-4")}>
                {
                    clearable && <Button
                        variant="link"
                        onClick={() => {
                            const reset = historyFilters(account, {})

                            setDate({
                                from: moment(reset.executedFrom).toDate(),
                                to: moment(reset.executedUntil).toDate()
                            })
                            setFilters(reset)
                            setClearable(false)
                        }}
                    >
                        Clear
                    </Button>
                }
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
                                setDate(value!)
                                setFilters(historyFilters(account, {
                                    ...filters,
                                    executedFrom: value!.from!.toISOString(),
                                    executedUntil: value!.to!.toISOString(),
                                }))
                                setClearable(true)
                            }}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Transactions</CardTitle>
                </CardHeader>
                <Accordion type="multiple">

                </Accordion>
                <History account={account} mutation={historyMutation} />
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

function History({
    account,
    mutation: { data: transactions, isPending, isError, error },
}: {
    account: Detailed,
    mutation: UseMutationResult<Transaction[], Error, ListFilters, unknown>,
}) {

    if (isError) throw error
    if (isPending) return (
        <CardContent>
            <div className="flex flex-row justify-center items-center">
                <Throbber /> <span>Fetching</span>
            </div>
        </CardContent>
    )
    if (isEmpty(transactions) || isNil(transactions)) return (
        <CardContent>
            <p>This account doesn't have any transactions for the period</p>
            <Button variant="outline" asChild={true}>
                <Link to="/accounts/new">Create New Transaction</Link>
            </Button>
        </CardContent>
    )

    return (
        <TransactionsTable
            account={account}
            transactions={transactions}
            sortByFn={(a, b) => Date.parse(b.executedAt!) - Date.parse(a.executedAt!)}
            groupByFn={({ executedAt }) => executedAt!}
            withUpcoming={true}
        />
    )
}

function TransactionsTable({
    account, transactions, sortByFn, groupByFn, withUpcoming
}: {
    account: Detailed
    transactions: Transaction[]
    sortByFn: (a: Transaction, b: Transaction) => number
    groupByFn: (tr: Transaction) => string,
    withUpcoming: boolean
}) {
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
                        <SectionRow
                            key={`transactions:${date.toISOString()}:${account.id}`}
                            date={date}
                            transactions={transactions}
                            account={account}
                            withUpcoming={withUpcoming}
                            upcomingDate={upcomingDate}
                        />
                    ))}
            </TableBody>
        </Table>
    )
}

interface SectionProps {
    account: Detailed
    date: Date
    transactions: Transaction[]
    withUpcoming: boolean
    upcomingDate: Date
}

function SectionRow({ account: { id: accountID }, date, transactions, withUpcoming, upcomingDate }: SectionProps) {
    const cellClassName = withUpcoming && date > upcomingDate ? "opacity-50" : ""

    return (
        <>
            <TableRow className={cn(date)}>
                <TableHead colSpan={3}>
                    {date.toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    })}
                </TableHead>
            </TableRow>
            {
                transactions.map(({ id, source, target, sourceAmount, targetAmount }) => {
                    const external = source.id === accountID ? target : source
                    const account = source.id === accountID ? source : target
                    const amount = source.id === accountID ? sourceAmount : targetAmount

                    return (<TableRow key={`transaction:&{accountID}:${id}:${withUpcoming}`}>
                        <TableCell
                            className={cn("text-center w-[5dvw]", cellClassName)}
                            style={{
                                backgroundColor: external.color,
                                color: accountContrastColor(external.color)
                            }}
                        >
                            {kindToHuman(external.kind)}
                        </TableCell>
                        <TableCell className={cellClassName}>
                            {
                                isNil(external.parent)
                                    ? `${external.name}`
                                    : `${external.parent.name} (${external.name})`
                            }
                        </TableCell>
                        <TableCell
                            className={
                                cn(
                                    "text-right w-[7.5dvw] font-semibold",
                                    currencyAmountColor(account.id === source.id ? -1 : 1),
                                    cellClassName
                                )
                            }
                        >
                            {currencyAmountToHuman(amount, account.currency)}
                        </TableCell>
                    </TableRow>)
                })
            }
        </>
    )
}