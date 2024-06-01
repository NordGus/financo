import { useQuery } from "@tanstack/react-query"
import { Outlet, useOutlet } from "react-router-dom"
import { useEffect, useState } from "react"
import { staleTimeDefault } from "../../queyClient"

import { getSummary } from "../../api/summary"
import { getAccounts } from "../../api/accounts"
import { getGoals } from "../../api/goals"

import Modal from "../../components/Modal"
import Panel from "../../components/Panel"
import SummaryCard from "../../components/SummaryCard"
import AccountPreviewWithNavigation from "../../components/account/preview/WithNavigation"
import GoalPreviewWithNavigation from "../../components/goal/preview/WithNavigation"

function PanelTitle({ title }: { title: string }) {
    return <h2 className="flex-grow flex items-center px-2">{title}</h2>
}

function AddButton() {
    return (
        <p
            className="flex items-center px-4 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
            Add
        </p>
    )
}

export default function AccountsAndGoals() {
    const summaryQuery = useQuery({
        queryKey: ['accounts', 'summary'],
        queryFn: getSummary,
        staleTime: staleTimeDefault
    })
    const capitalNormalAccountsQuery = useQuery({
        queryKey: ['accounts', 'capital', 'normal'],
        queryFn: getAccounts('capital/normal'),
        staleTime: staleTimeDefault
    })
    const capitalSavingsAccountsQuery = useQuery({
        queryKey: ['accounts', 'capital', 'savings'],
        queryFn: getAccounts('capital/savings'),
        staleTime: staleTimeDefault
    })
    const debtLoansAccountsQuery = useQuery({
        queryKey: ['accounts', 'debt', 'loans'],
        queryFn: getAccounts('debt/loans'),
        staleTime: staleTimeDefault
    })
    const debtCreditLinesAccountsQuery = useQuery({
        queryKey: ['accounts', 'debt', 'credit'],
        queryFn: getAccounts('debt/credit'),
        staleTime: staleTimeDefault
    })
    const externalIncomeAccountsQuery = useQuery({
        queryKey: ['accounts', 'external', 'income'],
        queryFn: getAccounts('external/income'),
        staleTime: staleTimeDefault
    })
    const externalExpensesAccountsQuery = useQuery({
        queryKey: ['accounts', 'external', 'expenses'],
        queryFn: getAccounts('external/expenses'),
        staleTime: staleTimeDefault
    })
    const goalsQuery = useQuery({
        queryKey: ['goals'],
        queryFn: getGoals,
        staleTime: staleTimeDefault
    })
    const outlet = useOutlet()
    const [outletCache, setOutletCache] = useState(outlet)

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
                            <AddButton />
                        </>
                    }
                    className="row-span-3"
                    loading={goalsQuery.isFetching}
                >
                    {
                        goalsQuery.data?.
                            map((goal) => (
                                <GoalPreviewWithNavigation key={`goal:${goal.id}`} goal={goal} />
                            ))
                    }
                </Panel>
                <Panel
                    header={
                        <>
                            <PanelTitle title="Bank Accounts" />
                            <AddButton />
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
                            <AddButton />
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
                            <AddButton />
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
                            <AddButton />
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
                            <AddButton />
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
                            <AddButton />
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
