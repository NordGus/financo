import { useQuery } from "@tanstack/react-query"
import { Outlet, useOutlet } from "react-router-dom"
import { useEffect, useState } from "react"

import { getAccounts } from "../../api/accounts"
import { getGoals } from "../../api/goals"

import Modal from "../../components/Modal"
import Panel from "../../components/Panel"
import SummaryCard from "../../components/SummaryCard"
import CapitalAccountPreview from "../../components/account/preview/capital/Account"
import DebtLoanAccountPreview from "../../components/account/preview/debt/Loan"
import DebtCreditLineAccountPreview from "../../components/account/preview/debt/CreditLine"
import ExternalAccountPreview from "../../components/account/preview/external/Account"

function PanelTitle({ title }: { title: string }) {
    return <h2 className="flex-grow flex items-center px-4">{title}</h2>
}

function AddButton() {
    return (
        <p
            className="
                flex items-center
                px-4
                cursor-pointer
                hover:bg-neutral-100 dark:hover:bg-neutral-800
            "
        >
            Add
        </p>
    )
}

export default function AccountsAndGoals() {
    const capitalNormalAccountsQuery = useQuery({
        queryKey: ['accounts', 'capital', 'normal'],
        queryFn: getAccounts('capital/normal')
    })

    const capitalSavingsAccountsQuery = useQuery({
        queryKey: ['accounts', 'capital', 'savings'],
        queryFn: getAccounts('capital/savings')
    })

    const debtLoansAccountsQuery = useQuery({
        queryKey: ['accounts', 'debt', 'loans'],
        queryFn: getAccounts('debt/loans')
    })

    const debtCreditLinesAccountsQuery = useQuery({
        queryKey: ['accounts', 'debt', 'credit'],
        queryFn: getAccounts('debt/credit')
    })

    const externalIncomeAccountsQuery = useQuery({
        queryKey: ['accounts', 'external', 'income'],
        queryFn: getAccounts('external/income')
    })

    const externalExpensesAccountsQuery = useQuery({
        queryKey: ['accounts', 'external', 'expenses'],
        queryFn: getAccounts('external/expenses')
    })

    const goalsQuery = useQuery({ queryKey: ['goals'], queryFn: getGoals })
    const outlet = useOutlet()
    const [outletCache, setOutletCache] = useState(outlet)

    useEffect(() => {
        if (outlet && !outletCache) setOutletCache(outlet)
    }, [outlet, outletCache])

    return (
        <>
            <div
                className="
                    grid grid-cols-4 grid-rows-[min-content_minmax(0,_1fr)_minmax(0,_1fr)] gap-1
                    h-full
                "
            >
                <SummaryCard
                    name="Capital"
                    summaries={[{ amount: 133742, currency: "EUR" }]}
                />
                <SummaryCard
                    name="Debts"
                    summaries={[{ amount: -133742, currency: "EUR" }]}
                />
                <SummaryCard
                    name="Total"
                    summaries={[{ amount: 133742, currency: "EUR" }]}
                />
                <Panel
                    header={
                        <>
                            <PanelTitle title="Goals" />
                            <AddButton />
                        </>
                    }
                    className="row-span-3"
                >
                    {
                        goalsQuery.data?.
                            map((goal) => (<p key={`goal:${goal.id}`}>{goal.name}</p>))
                    }
                </Panel>
                <Panel
                    header={
                        <>
                            <PanelTitle title="Bank Accounts" />
                            <AddButton />
                        </>
                    }
                >
                    {
                        capitalNormalAccountsQuery.data?.
                            map((account) => (
                                <CapitalAccountPreview
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
                >
                    {
                        debtLoansAccountsQuery.data?.
                            map((account) => (
                                <DebtLoanAccountPreview
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
                >
                    {
                        externalIncomeAccountsQuery.data?.
                            map((account) => (
                                <ExternalAccountPreview
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
                >
                    {
                        capitalSavingsAccountsQuery.data?.
                            map((account) => (
                                <CapitalAccountPreview
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
                >
                    {
                        debtCreditLinesAccountsQuery.data?.
                            map((account) => (
                                <DebtCreditLineAccountPreview
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
                >
                    {
                        externalExpensesAccountsQuery.data?.
                            map((account) => (
                                <ExternalAccountPreview
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
