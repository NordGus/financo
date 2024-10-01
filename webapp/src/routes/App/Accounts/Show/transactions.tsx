import { cn } from "@/lib/utils";
import { Detailed } from "@/types/Account";
import { Transaction } from "@/types/Transaction";
import { accountContrastColor } from "@helpers/account/accountContrastColor";
import kindToHuman from "@helpers/account/kindToHuman";
import currencyAmountColor from "@helpers/currencyAmountColor";
import currencyAmountToHuman from "@helpers/currencyAmountToHuman";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { groupBy, isEmpty, isNil } from "lodash";
import { SlidersHorizontalIcon } from "lucide-react";
import moment from "moment";
import { useEffect, useReducer, useState } from "react";
import { Link } from "react-router-dom";

import {
    getPendingTransactionsForAccount,
    getTransactionsForAccount,
    ListFilters,
    PendingFilters
} from "@api/transactions";

import { defaultFilters, reducer, TransactionsFilters } from "@components/filters/transactions";
import { Throbber } from "@components/Throbber";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@components/ui/accordion";
import { Button } from "@components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@components/ui/table";

interface Props {
    account: Detailed
    className?: string
}

// [x] make endpoints specialized to retrieved transactions for a given account
export function Transactions({ account, className }: Props) {
    const [filters, dispatch] = useReducer(reducer, { clearable: false, filters: defaultFilters() })
    const [openFilters, setOpenFilters] = useState(false)

    const pendingMutation = useMutation({
        mutationKey: ["transactions", "pending", "account", account.id],
        mutationFn: (filters: PendingFilters) => getPendingTransactionsForAccount(account.id, filters)
    })
    const upcomingMutation = useMutation({
        mutationKey: ["transactions", "upcoming", "account", account.id],
        mutationFn: (filters: ListFilters) => getTransactionsForAccount(account.id, filters)
    })
    const historyMutation = useMutation({
        mutationKey: ["transactions", "account", account.id],
        mutationFn: (filters: ListFilters) => getTransactionsForAccount(account.id, filters)
    })

    useEffect(() => {
        pendingMutation.mutate({ account: filters.filters.accounts, category: filters.filters.categories })
        upcomingMutation.mutate({
            executedFrom: moment().add({ days: 1 }).toISOString(),
            executedUntil: moment().add({ month: 1 }).toISOString(),
            account: filters.filters.accounts,
            category: filters.filters.categories
        })
        historyMutation.mutate({
            executedFrom: filters.filters.from?.toISOString(),
            executedUntil: filters.filters.to?.toISOString(),
            account: filters.filters.accounts,
            category: filters.filters.categories
        })
    }, [filters, account.updatedAt])

    return (
        <div className={className}>
            <Card className={className}>
                <CardHeader
                    className="flex flex-row justify-between items-start space-x-0 space-y-0"
                >
                    <div className="flex flex-row gap-2 items-center">
                        <CardTitle>Transactions</CardTitle>
                        {historyMutation.isPending && (<Throbber variant="small" className="inline-block" />)}
                    </div>
                    <div className={cn("flex justify-end gap-4")}>
                        {
                            filters.clearable && <Button variant="link" onClick={() => dispatch({ type: "CLEAR" })}>
                                Clear
                            </Button>
                        }
                        <Button variant="secondary" onClick={() => setOpenFilters(true)}>
                            <SlidersHorizontalIcon className="mr-2 h-4 w-4" /> Filter
                        </Button>
                    </div>
                </CardHeader>
                <TransactionsFilters
                    state={filters}
                    dispatch={dispatch}
                    open={openFilters}
                    setOpen={setOpenFilters}
                    excludeAccountIds={[account.id]}
                />
                <Accordion type="multiple">
                    <Pending account={account} mutation={pendingMutation} />
                    <Upcoming account={account} mutation={upcomingMutation} />
                </Accordion>
                <History account={account} mutation={historyMutation} />
            </Card>
        </div>
    )
}

function Pending({ account, mutation: { data: transactions, isPending, isError, error }, }: {
    account: Detailed,
    mutation: UseMutationResult<Transaction[], Error, ListFilters, unknown>,
}) {
    if (isError) throw error
    if ((isEmpty(transactions) || isNil(transactions)) && isPending) return null
    if ((isEmpty(transactions) || isNil(transactions)) && !isPending) return null

    return (
        <AccordionItem value="pending" className="border-none">
            <AccordionTrigger className="px-4">
                <span className="flex flex-row gap-2 items-center">
                    Pending {isPending && (<Throbber variant="small" className="inline-block" />)}
                </span>
            </AccordionTrigger>
            <AccordionContent className="pb-0 mb-4 border-b dark:border-zinc-800">
                <CardDescription className="px-4 mb-4">
                    Transactions with unknown Execution Date
                </CardDescription>
                {
                    isEmpty(transactions) || isNil(transactions)
                        ? null
                        : <TransactionsTable
                            account={account}
                            transactions={transactions}
                            sortByFn={(a, b) => Date.parse(a.issuedAt) - Date.parse(b.issuedAt)}
                            groupByFn={({ issuedAt }) => issuedAt}
                            withUpcoming={true}
                        />
                }
            </AccordionContent>
        </AccordionItem>
    )
}

function Upcoming({ account, mutation: { data: transactions, isPending, isError, error }, }: {
    account: Detailed,
    mutation: UseMutationResult<Transaction[], Error, ListFilters, unknown>,
}) {
    if (isError) throw error
    if ((isEmpty(transactions) || isNil(transactions)) && isPending) return null
    if ((isEmpty(transactions) || isNil(transactions)) && !isPending) return null

    return (
        <AccordionItem value="upcoming" className="border-none">
            <AccordionTrigger className="px-4">
                <span className="flex flex-row gap-2 items-center">
                    Upcoming {isPending && (<Throbber variant="small" className="inline-block" />)}
                </span>
            </AccordionTrigger>
            <AccordionContent className="pb-0 mb-4 border-b dark:border-zinc-800">
                <CardDescription className="px-4 mb-4">
                    Transactions that will become effective in the next month
                </CardDescription>
                {
                    isEmpty(transactions) || isNil(transactions)
                        ? null
                        : <TransactionsTable
                            account={account}
                            transactions={transactions}
                            sortByFn={(a, b) => Date.parse(a.executedAt!) - Date.parse(b.executedAt!)}
                            groupByFn={({ executedAt }) => executedAt!}
                            withUpcoming={false}
                        />
                }
            </AccordionContent>
        </AccordionItem>
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
    if (isPending) return null
    if (isEmpty(transactions) || isNil(transactions)) return (
        <CardContent className="space-y-2">
            <p>This account doesn't have any transactions for the period</p>
            <Button asChild={true}>
                <Link to="/ledger">Go to Ledger</Link>
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

                    return (
                        <TableRow
                            key={`transaction:&{accountID}:${id}:${withUpcoming}`}
                            className={cellClassName}
                        >
                            <TableCell
                                className="w-[4rem] text-center text-2xl p-0"
                                style={{
                                    backgroundColor: external.color,
                                    color: accountContrastColor(external.color)
                                }}
                            >
                                {kindToHuman(external.kind).at(0)}
                            </TableCell>
                            <TableCell>
                                {
                                    isNil(external.parent)
                                        ? `${external.name}`
                                        : `${external.parent.name} (${external.name})`
                                }
                            </TableCell>
                            <TableCell
                                className={
                                    cn(
                                        "text-right w-[7.5rem] font-semibold",
                                        currencyAmountColor(account.id === source.id ? -1 : 1)
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