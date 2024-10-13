import { cn } from "@/lib/utils";
import { Kind, Preview } from "@/types/Account";
import { getAccounts } from "@api/accounts";
import { Progress } from "@components/Progress";
import { Throbber } from "@components/Throbber";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@components/ui/accordion";
import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@components/ui/table";
import kindToHuman from "@helpers/account/kindToHuman";
import currencyAmountColor from "@helpers/currencyAmountColor";
import currencyAmountToHuman from "@helpers/currencyAmountToHuman";
import { staleTimeDefault } from "@queries/client";
import { useQuery } from "@tanstack/react-query";
import Color from "colorjs.io";
import { isEmpty, isNil } from "lodash";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";

function CapitalTable({ accounts, navigate }: { accounts: Preview[], navigate: NavigateFunction }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[20dvw]">Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[15dvw]">Kind</TableHead>
                    <TableHead className="w-[7.5dvw]">Balance</TableHead>
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

export function CapitalAccountsTable() {
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
        <div className="flex flex-col gap-4 px-6">
            {
                activeIsFetching
                    ? <div className="flex justify-center p-4 gap-2">
                        <Throbber /><span>Fetching</span>
                    </div>
                    : isNil(active) || isEmpty(active)
                        ? <>
                            <p>You have no active capital accounts</p>
                            <Button variant="outline" asChild={true}>
                                <Link to="/accounts/new">Create New Account</Link>
                            </Button>
                        </>
                        : <Card>
                            <CapitalTable accounts={active} navigate={navigate} />
                        </Card>
            }
            {
                archivedIsFetching
                    ? <div className="flex justify-center p-4 gap-2">
                        <Throbber /><span>Fetching</span>
                    </div>
                    : isEmpty(archived) || isNil(archived)
                        ? null
                        : <Accordion type="single" collapsible={true}>
                            <AccordionItem value="archived">
                                <AccordionTrigger>Archive</AccordionTrigger>
                                <AccordionContent>
                                    <Card>
                                        <CapitalTable accounts={archived} navigate={navigate} />
                                    </Card>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
            }
        </div>
    )
}

function DebtTable({ accounts, navigate }: { accounts: Preview[], navigate: NavigateFunction }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[5dvw]"></TableHead>
                    <TableHead className="w-[20dvw]">Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[15dvw]">Kind</TableHead>
                    <TableHead className="w-[7.5dvw]">Debt</TableHead>
                    <TableHead className="w-[7.5dvw]">Paid</TableHead>
                    <TableHead className="w-[7.5dvw]">Amount/Credit</TableHead>
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

export function DebtAccountsTable() {
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
        <div className="flex flex-col gap-4 px-6">
            {
                activeIsFetching
                    ? <div className="flex justify-center p-4 gap-2">
                        <Throbber /><span>Fetching</span>
                    </div>
                    : isNil(active) || isEmpty(active)
                        ? <>
                            <p>You have no active capital accounts</p>
                            <Button variant="outline" asChild={true}>
                                <Link to="/accounts/new">Create New Account</Link>
                            </Button>
                        </>
                        : <Card>
                            <DebtTable accounts={active} navigate={navigate} />
                        </Card>
            }
            {
                archivedIsFetching
                    ? <div className="flex justify-center p-4 gap-2">
                        <Throbber /><span>Fetching</span>
                    </div>
                    : isEmpty(archived) || isNil(archived)
                        ? null
                        : <Accordion type="single" collapsible={true}>
                            <AccordionItem value="archived">
                                <AccordionTrigger>Archive</AccordionTrigger>
                                <AccordionContent>
                                    <Card>
                                        <DebtTable accounts={archived} navigate={navigate} />
                                    </Card>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
            }
        </div>
    )
}

function ExternalTable({
    accounts, navigate
}: { accounts: Preview[], navigate: NavigateFunction }) {
    return <Table className="table-fixed">
        <TableHeader>
            <TableRow>
                <TableHead className="w-[20dvw]">Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[5dvw]">Currency</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {accounts.map((account) => <ExternalRow account={account} navigate={navigate} />)}
        </TableBody>
    </Table>
}

function ExternalRow({
    account: { id, name, description, currency }, navigate
}: { account: Preview, navigate: NavigateFunction }) {
    return (
        <TableRow
            key={`account:${id}`}
            className="cursor-pointer"
            onClick={() => navigate(`/accounts/${id}`)}
        >
            <TableCell>{name}</TableCell>
            <TableCell>{description}</TableCell>
            <TableCell>{currency}</TableCell>
        </TableRow>
    )
}

export function IncomeAccountsTable() {
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
        <div className="flex flex-col gap-4 px-6">
            {
                activeIsFetching
                    ? <div className="flex justify-center p-4 gap-2">
                        <Throbber /><span>Fetching</span>
                    </div>
                    : isNil(active) || isEmpty(active)
                        ? <>
                            <p>You have no active capital accounts</p>
                            <Button variant="outline" asChild={true}>
                                <Link to="/accounts/new">Create New Account</Link>
                            </Button>
                        </>
                        : <Card>
                            <ExternalTable accounts={active} navigate={navigate} />
                        </Card>
            }
            {
                archivedIsFetching
                    ? <div className="flex justify-center p-4 gap-2">
                        <Throbber /><span>Fetching</span>
                    </div>
                    : isEmpty(archived) || isNil(archived)
                        ? null
                        : <Accordion type="single" collapsible={true}>
                            <AccordionItem value="archived">
                                <AccordionTrigger>Archive</AccordionTrigger>
                                <AccordionContent>
                                    <Card>
                                        <ExternalTable accounts={archived} navigate={navigate} />
                                    </Card>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
            }
        </div>
    )
}

export function ExpenseAccountsTable() {
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
        <div className="flex flex-col gap-4 px-6">
            {
                activeIsFetching
                    ? <div className="flex justify-center p-4 gap-2">
                        <Throbber /><span>Fetching</span>
                    </div>
                    : isNil(active) || isEmpty(active)
                        ? <>
                            <p>You have no active capital accounts</p>
                            <Button variant="outline" asChild={true}>
                                <Link to="/accounts/new">Create New Account</Link>
                            </Button>
                        </>
                        : <Card>
                            <ExternalTable accounts={active} navigate={navigate} />
                        </Card>
            }
            {
                archivedIsFetching
                    ? <div className="flex justify-center p-4 gap-2">
                        <Throbber /><span>Fetching</span>
                    </div>
                    : isEmpty(archived) || isNil(archived)
                        ? null
                        : <Accordion type="single" collapsible={true}>
                            <AccordionItem value="archived">
                                <AccordionTrigger>Archive</AccordionTrigger>
                                <AccordionContent>
                                    <Card>
                                        <ExternalTable accounts={archived} navigate={navigate} />
                                    </Card>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
            }
        </div>
    )
}
