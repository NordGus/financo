import { useQuery } from "@tanstack/react-query"
import { Outlet, useOutlet } from "react-router-dom"
import { useEffect, useState } from "react"
import { staleTimeDefault } from "../../../queyClient"

import { getSummary } from "../../../api/summary"
import { getAccounts } from "../../../api/accounts"

import Modal from "@components/Modal"
import Panel, { ActionLink, Title } from "@components/Panel"
import SummaryCard from "@components/SummaryCard"
import AccountPreviewWithNavigation from "@components/account/preview/WithNavigation"
import GoalsPanel from "./GoalsPanel"
import CapitalAccounts from "./CapitalAccounts"

const summaryQueryOptions = {
    queryKey: ['accounts', 'summary'],
    queryFn: getSummary,
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

export default function AccountsAndGoals() {
    const summaryQuery = useQuery(summaryQueryOptions)

    const debtLoansAccountsQuery = useQuery(activeDebtLoansAccountsQueryOptions)
    const debtCreditLinesAccountsQuery = useQuery(activeCreditLinesAccountsQueryOptions)
    const externalIncomeAccountsQuery = useQuery(activeExternalIcomeAccountsQuery)
    const externalExpensesAccountsQuery = useQuery(activeExternalExpensesAccountsQuery)

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
                <GoalsPanel className="row-span-3" />
                <CapitalAccounts.NormalPanel />
                <Panel
                    header={
                        <>
                            <Title text="Loans" grow={true} />
                            <ActionLink to={"/accounts"} text="Add" />
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
                            <Title text="Income" grow={true} />
                            <ActionLink to={"/accounts"} text="Add" />
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
                <CapitalAccounts.SavingsPanel />
                <Panel
                    header={
                        <>
                            <Title text="Credit Lines" grow={true} />
                            <ActionLink to={"/accounts"} text="Add" />
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
                            <Title text="Expenses" grow={true} />
                            <ActionLink to={"/accounts"} text="Add" />
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
