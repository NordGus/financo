import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Color from "colorjs.io";
import { isEmpty, isNil } from "lodash";

import { Kind } from "@/types/Account";

import kindToHuman from "@helpers/account/kindToHuman";
import currencyAmountColor from "@helpers/currencyAmountColor";
import currencyAmountToHuman from "@helpers/currencyAmountToHuman";

import { staleTimeDefault } from "@queries/Client";
import { getAccounts } from "@api/accounts";

import { Throbber } from "@components/Throbber";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@components/ui/table";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@components/ui/accordion";

export function CapitalAccountsTable({ }) {
    const navigate = useNavigate()

    const {
        data: active,
        isFetching: activeIsFetching,
        isError: activeIsError,
        error: activeError
    } = useQuery({
        queryKey: ["accounts", "capital", "list"],
        queryFn: getAccounts({ kind: [Kind.CapitalNormal, Kind.CapitalSavings] }),
        staleTime: staleTimeDefault
    })

    const {
        data: archived,
        isFetching: archivedIsFetching,
        isError: archivedIsError,
        error: archivedError
    } = useQuery({
        queryKey: ["accounts", "capital", "list", "archived"],
        queryFn: getAccounts({ kind: [Kind.CapitalNormal, Kind.CapitalSavings], archived: true }),
        staleTime: staleTimeDefault
    })

    if (activeIsError) throw activeError
    if (archivedIsError) throw archivedError

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="space-y-2">
                    <CardTitle>Capital</CardTitle>
                    <CardDescription>
                        Recent orders from your store.
                    </CardDescription>
                </div>
                {activeIsFetching || archivedIsFetching && <Throbber variant="small" />}
            </CardHeader>
            <CardContent className="mt-4 space-y-4">
                {
                    isNil(active) || isEmpty(active)
                        ? <div></div>
                        : <div className="rounded-md border dark:border-zinc-800">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Kind</TableHead>
                                        <TableHead>Balance</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        active.map(({
                                            id, kind, name, description, balance, currency, color
                                        }) => {
                                            const clr = new Color(color)
                                                .to("HSL")
                                                .set({ l: (l) => l >= 50 ? 1 : 100 })
                                                .toString({ precision: 3, format: "rgb" })

                                            return <TableRow
                                                className="cursor-pointer"
                                                onClick={() => navigate(`/accounts/${id}`)}
                                            >
                                                <TableCell>
                                                    {name}
                                                </TableCell>
                                                <TableCell>{description}</TableCell>
                                                <TableCell>
                                                    <span
                                                        className="px-2 py-1 rounded-md text-xs"
                                                        style={{
                                                            backgroundColor: color,
                                                            color: clr
                                                        }}
                                                    >
                                                        {kindToHuman(kind)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className={currencyAmountColor(balance)}>
                                                    {currencyAmountToHuman(balance, currency)}
                                                </TableCell>
                                            </TableRow>
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </div>
                }
                <Accordion type="single" collapsible={true}>
                    <AccordionItem value="archived">
                        <AccordionTrigger>Archive</AccordionTrigger>
                        <AccordionContent>
                            {
                                isNil(archived) || isEmpty(archived)
                                    ? <div></div>
                                    : <div className="rounded-md border dark:border-zinc-800">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Description</TableHead>
                                                    <TableHead>Kind</TableHead>
                                                    <TableHead>Balance</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {
                                                    archived.map(({
                                                        id, kind, name, description, balance, currency, color
                                                    }) => {
                                                        const clr = new Color(color)
                                                            .to("HSL")
                                                            .set({ l: (l) => l >= 50 ? 1 : 100 })
                                                            .toString({ precision: 3, format: "rgb" })

                                                        return <TableRow
                                                            className="cursor-pointer"
                                                            onClick={() => navigate(`/accounts/${id}`)}
                                                        >
                                                            <TableCell>
                                                                {name}
                                                            </TableCell>
                                                            <TableCell>{description}</TableCell>
                                                            <TableCell>
                                                                <span
                                                                    className="px-2 py-1 rounded-md text-xs"
                                                                    style={{
                                                                        backgroundColor: color,
                                                                        color: clr
                                                                    }}
                                                                >
                                                                    {kindToHuman(kind)}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell
                                                                className={currencyAmountColor(balance)}
                                                            >
                                                                {
                                                                    currencyAmountToHuman(
                                                                        balance,
                                                                        currency
                                                                    )
                                                                }
                                                            </TableCell>
                                                        </TableRow>
                                                    })
                                                }
                                            </TableBody>
                                        </Table>
                                    </div>
                            }
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card >
    )
}

export function DebtAccountsTable({ }) {
    const { data: accounts, isFetching, isError, error } = useQuery({
        queryKey: ["accounts", "debt", "list"],
        queryFn: getAccounts({ kind: [Kind.DebtLoan, Kind.DebtPersonal, Kind.DebtCredit] }),
        staleTime: staleTimeDefault
    })

    if (isError) throw error

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-2">
                    <CardTitle>Debts and Credit Lines</CardTitle>
                    <CardDescription>
                        Recent orders from your store.
                    </CardDescription>
                </div>
                {isFetching && <Throbber variant="small" />}
            </CardHeader>
            <CardContent>
                {
                    isNil(accounts) || isEmpty(accounts)
                        ? <div></div>
                        : <Table>

                        </Table>
                }
            </CardContent>
        </Card>
    )
}

export function IncomeAccountsTable({ }) {
    const { data: accounts, isFetching, isError, error } = useQuery({
        queryKey: ["accounts", "income", "list"],
        queryFn: getAccounts({ kind: [Kind.ExternalIncome] }),
        staleTime: staleTimeDefault
    })

    if (isError) throw error

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-2">
                    <CardTitle>Income Sources and Incoming Transactions</CardTitle>
                    <CardDescription>
                        Recent orders from your store.
                    </CardDescription>
                </div>
                {isFetching && <Throbber variant="small" />}
            </CardHeader>
            <CardContent>
                {
                    isNil(accounts) || isEmpty(accounts)
                        ? <div></div>
                        : <Table>

                        </Table>
                }
            </CardContent>
        </Card>
    )
}

export function ExpenseAccountsTable({ }) {
    const { data: accounts, isFetching, isError, error } = useQuery({
        queryKey: ["accounts", "expenses", "list"],
        queryFn: getAccounts({ kind: [Kind.ExternalExpense] }),
        staleTime: staleTimeDefault
    })

    if (isError) throw error

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-2">
                    <CardTitle>Expenses and Outgoing Transactions</CardTitle>
                    <CardDescription>
                        Recent orders from your store.
                    </CardDescription>
                </div>
                {isFetching && <Throbber variant="small" />}
            </CardHeader>
            <CardContent>
                {
                    isNil(accounts) || isEmpty(accounts)
                        ? <div></div>
                        : <Table>

                        </Table>
                }
            </CardContent>
        </Card>
    )
}
