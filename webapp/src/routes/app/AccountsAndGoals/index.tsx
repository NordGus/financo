import { useQuery } from "@tanstack/react-query"
import { Outlet, useOutlet } from "react-router-dom"
import { useEffect, useState } from "react"
import { staleTimeDefault } from "../../../queyClient"

import { getSummary } from "../../../api/summary"

import Modal from "@components/Modal"
import SummaryCard from "@components/SummaryCard"
import GoalsPanel from "./GoalsPanel"
import CapitalAccounts from "./CapitalAccounts"
import DebtAccounts from "./DebtAccounts"
import ExternalAccounts from "./ExternalAccounts"

const summaryQueryOptions = {
    queryKey: ['accounts', 'summary'],
    queryFn: getSummary,
    staleTime: staleTimeDefault
}

export default function AccountsAndGoals() {
    const summaryQuery = useQuery(summaryQueryOptions)
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
                <DebtAccounts.LoansPanel />
                <ExternalAccounts.IncomePanel />
                <CapitalAccounts.SavingsPanel />
                <DebtAccounts.CreditLinesPanel />
                <ExternalAccounts.ExpensesPanel />
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
