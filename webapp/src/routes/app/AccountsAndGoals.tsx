import { useQuery } from "@tanstack/react-query"
import { Link, Outlet, useOutlet } from "react-router-dom"
import { useEffect, useState } from "react"
import { staleTimeDefault } from "../../queyClient"

import { getSummary } from "../../api/summary"
import { getAccounts } from "../../api/accounts"
import { getArchivedGoals, getGoals, getReachedGoals } from "../../api/goals"

import Modal from "../../components/Modal"
import Panel from "../../components/Panel"
import SummaryCard from "../../components/SummaryCard"
import AccountPreviewWithNavigation from "../../components/account/preview/WithNavigation"
import GoalPreviewWithNavigation from "../../components/goal/preview/WithNavigation"

function PanelTitle({ title }: { title: string }) {
    return <h2 className="flex-grow flex items-center px-2">{title}</h2>
}

function HeaderButton(
    {
        onClick, to, name, active = false, grow = false
    }: { name: string, onClick?: () => void, to?: string, active?: boolean, grow?: boolean }
) {
    const className = `flex items-center justify-center px-4 cursor-pointer ${active ? "bg-neutral-100 dark:bg-neutral-800" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"} ${grow ? "flex-grow" : ""}`

    if (!!to) return <Link to={to} className={className}>{name}</Link>
    return <p className={className} onClick={onClick!}>{name}</p>
}

const summaryQueryOptions = {
    queryKey: ['accounts', 'summary'],
    queryFn: getSummary,
    staleTime: staleTimeDefault
}

const activeCapitalNormalAccountsQueryOptions = {
    queryKey: ['accounts', 'capital', 'normal', 'active'],
    queryFn: getAccounts('capital/normal'),
    staleTime: staleTimeDefault
}

const activeCapitalSavingsAccountsQueryOptions = {
    queryKey: ['accounts', 'capital', 'savings', 'active'],
    queryFn: getAccounts('capital/savings'),
    staleTime: staleTimeDefault
}

const activeDebtLoansAccountsQueryOptions = {
    queryKey: ['accounts', 'debt', 'loans', 'active'],
    queryFn: getAccounts('debt/loans'),
    staleTime: staleTimeDefault
}

const activeCreditLinesAccountsQueryOptions = {
    queryKey: ['accounts', 'debt', 'credit', 'active'],
    queryFn: getAccounts('debt/credit'),
    staleTime: staleTimeDefault
}

const activeExternalIcomeAccountsQuery = {
    queryKey: ['accounts', 'external', 'income', 'active'],
    queryFn: getAccounts('external/income'),
    staleTime: staleTimeDefault
}

const activeExternalExpensesAccountsQuery = {
    queryKey: ['accounts', 'external', 'expnses', 'active'],
    queryFn: getAccounts('external/expenses'),
    staleTime: staleTimeDefault
}

const activeGoalsQueryOptions = {
    queryKey: ['goals', 'active'],
    queryFn: getGoals,
    staleTime: staleTimeDefault
}

const archivedGoalsQueryOptions = {
    queryKey: ['goals', 'archived'],
    queryFn: getArchivedGoals,
    staleTime: staleTimeDefault
}

const reachedGoalsQueryOptions = {
    queryKey: ['goals', 'reached'],
    queryFn: getReachedGoals,
    staleTime: staleTimeDefault
}

type GoalsQuery = "active" | "archived" | "reached"

export default function AccountsAndGoals() {
    const summaryQuery = useQuery(summaryQueryOptions)
    const capitalNormalAccountsQuery = useQuery(activeCapitalNormalAccountsQueryOptions)
    const capitalSavingsAccountsQuery = useQuery(activeCapitalSavingsAccountsQueryOptions)
    const debtLoansAccountsQuery = useQuery(activeDebtLoansAccountsQueryOptions)
    const debtCreditLinesAccountsQuery = useQuery(activeCreditLinesAccountsQueryOptions)
    const externalIncomeAccountsQuery = useQuery(activeExternalIcomeAccountsQuery)
    const externalExpensesAccountsQuery = useQuery(activeExternalExpensesAccountsQuery)

    // goals queries
    const activeGoalsQuery = useQuery(activeGoalsQueryOptions)
    const archivedGoalsQuery = useQuery(archivedGoalsQueryOptions)
    const reachedGoalsQuery = useQuery(reachedGoalsQueryOptions)

    const outlet = useOutlet()
    const [outletCache, setOutletCache] = useState(outlet)

    const [currentGoalsQuery, setCurrentGoalsQuery] = useState<GoalsQuery>("active")

    useEffect(() => {
        if (outlet && !outletCache) setOutletCache(outlet)
    }, [outlet, outletCache])

    return (
        <>
            <div
                className="grid grid-cols-4 grid-rows-[min-content_minmax(0,_1fr)_minmax(0,_1fr)] gap-1 h-full"
            >
                <SummaryCard
                    name="Capital"
                    loading={summaryQuery.isFetching}
                    summaries={summaryQuery?.data?.capital || []}
                />
                <SummaryCard
                    name="Debts"
                    loading={summaryQuery.isFetching}
                    summaries={summaryQuery?.data?.debt || []}
                />
                <SummaryCard
                    name="Total"
                    loading={summaryQuery.isFetching}
                    summaries={summaryQuery?.data?.total || []}
                />
                <Panel
                    header={
                        <>
                            <PanelTitle title="Goals" />
                            <HeaderButton to={"/accounts"} name="Add" />
                        </>
                    }
                    tabs={
                        <>
                            <HeaderButton
                                name="Active"
                                onClick={() => setCurrentGoalsQuery("active")}
                                active={currentGoalsQuery === "active"}
                                grow={true}
                            />
                            <HeaderButton
                                name="Archived"
                                onClick={() => setCurrentGoalsQuery("archived")}
                                active={currentGoalsQuery === "archived"}
                                grow={true}
                            />
                            <HeaderButton
                                name="Reached"
                                onClick={() => setCurrentGoalsQuery("reached")}
                                active={currentGoalsQuery === "reached"}
                                grow={true}
                            />
                        </>
                    }
                    className="row-span-3"
                    loading={
                        currentGoalsQuery === "active"
                            ? activeGoalsQuery.isFetching
                            : currentGoalsQuery === "archived"
                                ? archivedGoalsQuery.isFetching
                                : reachedGoalsQuery.isFetching
                    }
                >
                    {
                        currentGoalsQuery === "active"
                            ? activeGoalsQuery.data?.
                                map((goal) => (
                                    <GoalPreviewWithNavigation
                                        key={`goal:${goal.id}`}
                                        goal={goal}
                                    />
                                ))
                            : currentGoalsQuery === "archived"
                                ? archivedGoalsQuery.data?.
                                    map((goal) => (
                                        <GoalPreviewWithNavigation
                                            key={`goal:${goal.id}`}
                                            goal={goal}
                                        />
                                    ))
                                : reachedGoalsQuery.data?.
                                    map((goal) => (
                                        <GoalPreviewWithNavigation
                                            key={`goal:${goal.id}`}
                                            goal={goal}
                                        />
                                    ))
                    }
                </Panel>
                <Panel
                    header={
                        <>
                            <PanelTitle title="Bank Accounts" />
                            <HeaderButton to={"/accounts"} name="Add" />
                        </>
                    }
                    loading={capitalNormalAccountsQuery.isFetching}
                >
                    {
                        capitalNormalAccountsQuery.data?.
                            map((account) => (
                                <AccountPreviewWithNavigation
                                    key={`account:${account.id}`}
                                    account={account}
                                />
                            ))
                    }
                </Panel>
                <Panel
                    header={
                        <>
                            <PanelTitle title="Loans" />
                            <HeaderButton to={"/accounts"} name="Add" />
                        </>
                    }
                    loading={debtLoansAccountsQuery.isFetching}
                >
                    {
                        debtLoansAccountsQuery.data?.
                            map((account) => (
                                <AccountPreviewWithNavigation
                                    key={`account:${account.id}`}
                                    account={account}
                                />
                            ))
                    }
                </Panel>
                <Panel
                    header={
                        <>
                            <PanelTitle title="Income" />
                            <HeaderButton to={"/accounts"} name="Add" />
                        </>
                    }
                    loading={externalIncomeAccountsQuery.isFetching}
                >
                    {
                        externalIncomeAccountsQuery.data?.
                            map((account) => (
                                <AccountPreviewWithNavigation
                                    key={`account:${account.id}`}
                                    account={account}
                                />
                            ))
                    }
                </Panel>
                <Panel
                    header={
                        <>
                            <PanelTitle title="Savings" />
                            <HeaderButton to={"/accounts"} name="Add" />
                        </>
                    }
                    loading={capitalSavingsAccountsQuery.isFetching}
                >
                    {
                        capitalSavingsAccountsQuery.data?.
                            map((account) => (
                                <AccountPreviewWithNavigation
                                    key={`account:${account.id}`}
                                    account={account}
                                />
                            ))
                    }
                </Panel>
                <Panel
                    header={
                        <>
                            <PanelTitle title="Credit Lines" />
                            <HeaderButton to={"/accounts"} name="Add" />
                        </>
                    }
                    loading={debtCreditLinesAccountsQuery.isFetching}
                >
                    {
                        debtCreditLinesAccountsQuery.data?.
                            map((account) => (
                                <AccountPreviewWithNavigation
                                    key={`account:${account.id}`}
                                    account={account}
                                />
                            ))
                    }
                </Panel>
                <Panel
                    header={
                        <>
                            <PanelTitle title="Expenses" />
                            <HeaderButton to={"/accounts"} name="Add" />
                        </>
                    }
                    loading={externalExpensesAccountsQuery.isFetching}
                >
                    {
                        externalExpensesAccountsQuery.data?.
                            map((account) => (
                                <AccountPreviewWithNavigation
                                    key={`account:${account.id}`}
                                    account={account}
                                />
                            ))
                    }
                </Panel>
            </div>
            <Modal open={!!outlet} onClose={() => setOutletCache(null)}>
                {
                    outlet
                        ? <Outlet />
                        : (outletCache)
                }
            </Modal>
        </>
    )
}
