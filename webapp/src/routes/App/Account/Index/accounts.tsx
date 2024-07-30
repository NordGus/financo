import { useState } from "react";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Color from "colorjs.io";
import { isEmpty, isNil } from "lodash";
import { MinusIcon, PlusIcon } from "lucide-react";

import { Kind, Preview } from "@/types/Account";

import kindToHuman from "@helpers/account/kindToHuman";
import currencyAmountColor from "@helpers/currencyAmountColor";
import currencyAmountToHuman from "@helpers/currencyAmountToHuman";
import { cn } from "@/lib/utils";

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
import { Progress } from "@components/Progress";
import { Button } from "@components/ui/button";

function CapitalTable({ accounts, navigate }: { accounts: Preview[], navigate: NavigateFunction }) {
    return (
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
                    accounts.map(({
                        id, kind, name, description, balance, currency, color
                    }) => {
                        const clr = new Color(color)
                            .to("HSL")
                            .set({ l: (l) => l >= 50 ? 1 : 100 })
                            .toString({ precision: 3, format: "rgb" })

                        return <TableRow
                            key={`account:${id}`}
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
                            <TableCell className={currencyAmountColor(balance, false)}>
                                {currencyAmountToHuman(Math.abs(balance), currency)}
                            </TableCell>
                        </TableRow>
                    })
                }
            </TableBody>
        </Table>
    )
}

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
                        Represents your bank account, cash or savings accounts
                    </CardDescription>
                </div>
                {activeIsFetching || archivedIsFetching && <Throbber variant="small" />}
            </CardHeader>
            <CardContent className="mt-4 space-y-4">
                {
                    isNil(active) || isEmpty(active)
                        ? <>
                            <p>You have no active capital accounts</p>
                            <Button variant="outline" asChild={true}>
                                <Link to="/accounts/new">Create New Account</Link>
                            </Button>
                        </>
                        : <div className="rounded-md border dark:border-zinc-800">
                            <CapitalTable accounts={active} navigate={navigate} />
                        </div>
                }
                {
                    isEmpty(archived) || isNil(archived)
                        ? null
                        : <Accordion type="single" collapsible={true}>
                            <AccordionItem value="archived">
                                <AccordionTrigger>Archive</AccordionTrigger>
                                <AccordionContent>
                                    <div className="rounded-md border dark:border-zinc-800">
                                        <CapitalTable accounts={archived} navigate={navigate} />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                }
            </CardContent>
        </Card>
    )
}

function DebtTable({ accounts, navigate }: { accounts: Preview[], navigate: NavigateFunction }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Kind</TableHead>
                    <TableHead>Debt</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Amount/Credit</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    accounts.map(({
                        id, kind, name, description, balance, capital, currency, color
                    }) => {
                        const paid = capital + balance
                        const amount = kind === Kind.DebtCredit ? capital : (-capital)
                        const clr = new Color(color)
                            .to("HSL")
                            .set({ l: (l) => l >= 50 ? 1 : 100 })
                            .toString({ precision: 3, format: "rgb" })

                        return <TableRow
                            key={`account:${id}`}
                            className="cursor-pointer"
                            onClick={() => navigate(`/accounts/${id}`)}
                        >
                            <TableCell>
                                <Progress
                                    progress={Math.abs(paid / capital)} color={color}
                                />
                            </TableCell>
                            <TableCell>
                                {name}
                            </TableCell>
                            <TableCell>{description}</TableCell>
                            <TableCell className="space-x-2">
                                <span
                                    className="px-2 py-1 rounded-md text-xs"
                                    style={{
                                        backgroundColor: color,
                                        color: clr
                                    }}
                                >
                                    {kindToHuman(kind)}
                                </span>
                                <span
                                    className={cn(
                                        "px-2 py-1 rounded-md text-xs text-zinc-950",
                                        `${capital < 0 ? "bg-green-500" : "bg-red-500"}`
                                    )}
                                >
                                    {capital < 0 ? "I'm owed" : "I owe"}
                                </span>
                            </TableCell>
                            <TableCell
                                className={currencyAmountColor(balance, false)}
                            >
                                {currencyAmountToHuman(Math.abs(balance), currency)}
                            </TableCell>
                            <TableCell
                                className={currencyAmountColor(paid, false)}
                            >
                                {currencyAmountToHuman(Math.abs(paid), currency)}
                            </TableCell>
                            <TableCell
                                className={currencyAmountColor(amount, false)}
                            >
                                {currencyAmountToHuman(Math.abs(amount), currency)}
                            </TableCell>
                        </TableRow>
                    })
                }
            </TableBody>
        </Table>
    )
}

export function DebtAccountsTable({ }) {
    const navigate = useNavigate()
    const {
        data: active,
        isFetching: activeIsFetching,
        isError: activeIsError,
        error: activeError
    } = useQuery({
        queryKey: ["accounts", "debt", "list"],
        queryFn: getAccounts({ kind: [Kind.DebtLoan, Kind.DebtPersonal, Kind.DebtCredit] }),
        staleTime: staleTimeDefault
    })
    const {
        data: archived,
        isFetching: archivedIsFetching,
        isError: archivedIsError,
        error: archivedError
    } = useQuery({
        queryKey: ["accounts", "debt", "list", "archived"],
        queryFn: getAccounts({
            kind: [Kind.DebtLoan, Kind.DebtPersonal, Kind.DebtCredit], archived: true
        }),
        staleTime: staleTimeDefault
    })

    if (activeIsError) throw activeError
    if (archivedIsError) throw archivedError

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-2">
                    <CardTitle>Debts and Credit Lines</CardTitle>
                    <CardDescription>
                        Represent loans of any kind, debts between you and your friends or any kind of credit line, like credit cards
                    </CardDescription>
                </div>
                {activeIsFetching || archivedIsFetching && <Throbber variant="small" />}
            </CardHeader>
            <CardContent className="mt-4 space-y-4">
                {
                    isNil(active) || isEmpty(active)
                        ? <>
                            <p>You have no active debts</p>
                            <Button variant="outline" asChild={true}>
                                <Link to="/accounts/new">Create New Account</Link>
                            </Button>
                        </>
                        : <div className="rounded-md border dark:border-zinc-800">
                            <DebtTable accounts={active} navigate={navigate} />
                        </div>
                }
                {
                    isEmpty(archived) || isNil(archived)
                        ? null
                        : <Accordion type="single" collapsible={true}>
                            <AccordionItem value="archived">
                                <AccordionTrigger>Archive</AccordionTrigger>
                                <AccordionContent>
                                    <div className="rounded-md border dark:border-zinc-800">
                                        <DebtTable accounts={archived} navigate={navigate} />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                }
            </CardContent>
        </Card>
    )
}

function ExternalTable({
    accounts, navigate
}: { accounts: Preview[], navigate: NavigateFunction }) {
    return <Table className="table-fixed">
        <TableHeader>
            <TableRow>
                <TableHead className="w-[3rem]"></TableHead>
                <TableHead className="w-[20rem]">Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[8rem]">Currency</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {
                accounts.map((account) => <ExternalRow account={account} navigate={navigate} />)
            }
        </TableBody>
    </Table>
}

function ExternalRow({
    account: { id, name, description, currency, children }, navigate
}: { account: Preview, navigate: NavigateFunction }) {
    const [showChildren, setShowChildren] = useState(false)
    const isChildless = isEmpty(children) || isNil(children)

    return (
        <>
            <TableRow
                key={`account:${id}`}
                className="cursor-pointer"
            >
                {
                    isChildless
                        ? <TableCell onClick={() => navigate(`/accounts/${id}`)}></TableCell>
                        : <TableCell
                            onClick={() => setShowChildren(!showChildren)}
                            className="text-center"
                        >
                            {
                                showChildren
                                    ? <MinusIcon className="inline-block" />
                                    : <PlusIcon className="inline-block" />
                            }
                        </TableCell>
                }
                <TableCell onClick={() => navigate(`/accounts/${id}`)}>{name}</TableCell>
                <TableCell onClick={() => navigate(`/accounts/${id}`)}>{description}</TableCell>
                <TableCell onClick={() => navigate(`/accounts/${id}`)}>{currency}</TableCell>
            </TableRow>
            {
                isChildless
                    ? null
                    : showChildren
                        ? children.map((child) => <TableRow
                            key={`account:${id}`}
                            className="cursor-pointer"
                            onClick={() => navigate(`/accounts/${id}`)}
                        >
                            <TableCell></TableCell>
                            <TableCell>{name} ({child.name})</TableCell>
                            <TableCell>{child.description}</TableCell>
                            <TableCell>{child.currency}</TableCell>
                        </TableRow>)
                        : null
            }
        </>
    )
}

export function IncomeAccountsTable({ }) {
    const navigate = useNavigate()
    const {
        data: active,
        isFetching: activeIsFetching,
        isError: activeIsError,
        error: activeError
    } = useQuery({
        queryKey: ["accounts", "income", "list"],
        queryFn: getAccounts({ kind: [Kind.ExternalIncome] }),
        staleTime: staleTimeDefault
    })
    const {
        data: archived,
        isFetching: archivedIsFetching,
        isError: archivedIsError,
        error: archivedError
    } = useQuery({
        queryKey: ["accounts", "income", "list", "archived"],
        queryFn: getAccounts({ kind: [Kind.ExternalIncome], archived: true }),
        staleTime: staleTimeDefault
    })

    if (activeIsError) throw activeError
    if (archivedIsError) throw archivedError

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-2">
                    <CardTitle>Income Sources and Incoming Transactions</CardTitle>
                    <CardDescription>
                        Represent any possible incoming source of currency
                    </CardDescription>
                </div>
                {activeIsFetching && archivedIsFetching && <Throbber variant="small" />}
            </CardHeader>
            <CardContent className="mt-4 space-y-4">
                {
                    isNil(active) || isEmpty(active)
                        ? <>
                            <p>You have no active income sources</p>
                            <Button variant="outline" asChild={true}>
                                <Link to="/accounts/new">Create New Account</Link>
                            </Button>
                        </>
                        : <div className="rounded-md border dark:border-zinc-800">
                            <ExternalTable accounts={active} navigate={navigate} />
                        </div>
                }
                {
                    isEmpty(archived) || isNil(archived)
                        ? null
                        : <Accordion type="single" collapsible={true}>
                            <AccordionItem value="archived">
                                <AccordionTrigger>Archive</AccordionTrigger>
                                <AccordionContent>
                                    <div className="rounded-md border dark:border-zinc-800">
                                        <ExternalTable accounts={archived} navigate={navigate} />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                }
            </CardContent>
        </Card>
    )
}

export function ExpenseAccountsTable({ }) {
    const navigate = useNavigate()
    const {
        data: active,
        isFetching: activeIsFetching,
        isError: activeIsError,
        error: activeError
    } = useQuery({
        queryKey: ["accounts", "expense", "list"],
        queryFn: getAccounts({ kind: [Kind.ExternalExpense] }),
        staleTime: staleTimeDefault
    })
    const {
        data: archived,
        isFetching: archivedIsFetching,
        isError: archivedIsError,
        error: archivedError
    } = useQuery({
        queryKey: ["accounts", "expense", "list", "archived"],
        queryFn: getAccounts({ kind: [Kind.ExternalExpense], archived: true }),
        staleTime: staleTimeDefault
    })

    if (activeIsError) throw activeError
    if (archivedIsError) throw archivedError

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-2">
                    <CardTitle>Expenses and Outgoing Transactions</CardTitle>
                    <CardDescription>
                        Represent any possible expense or outgoing source of currency
                    </CardDescription>
                </div>
                {activeIsFetching || archivedIsFetching && <Throbber variant="small" />}
            </CardHeader>
            <CardContent className="mt-4 space-y-4">
                {
                    isNil(active) || isEmpty(active)
                        ? <>
                            <p>You have no active expense sources</p>
                            <Button variant="outline" asChild={true}>
                                <Link to="/accounts/new">Create New Account</Link>
                            </Button>
                        </>
                        : <div className="rounded-md border dark:border-zinc-800">
                            <ExternalTable accounts={active} navigate={navigate} />
                        </div>
                }
                {
                    isEmpty(archived) || isNil(archived)
                        ? null
                        : <Accordion type="single" collapsible={true}>
                            <AccordionItem value="archived">
                                <AccordionTrigger>Archive</AccordionTrigger>
                                <AccordionContent>
                                    <div className="rounded-md border dark:border-zinc-800">
                                        <ExternalTable accounts={archived} navigate={navigate} />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                }
            </CardContent>
        </Card>
    )
}
