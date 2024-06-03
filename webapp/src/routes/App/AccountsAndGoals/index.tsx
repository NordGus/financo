import { Outlet, useOutlet } from "react-router-dom"
import { useEffect, useState } from "react"

import Modal from "@components/Modal"

import Summary from "./Summary"
import Goals from "./Goals"
import CapitalAccounts from "./CapitalAccounts"
import DebtAccounts from "./DebtAccounts"
import ExternalAccounts from "./ExternalAccounts"

export default function AccountsAndGoals() {
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
                <Summary.Capital />
                <Summary.Debts />
                <Summary.Total />
                <div></div>
                <CapitalAccounts.NormalPanel />
                <DebtAccounts.LoansPanel />
                <ExternalAccounts.IncomePanel />
                <Goals.AdministrationPanel />
                <CapitalAccounts.SavingsPanel />
                <DebtAccounts.CreditLinesPanel />
                <ExternalAccounts.ExpensesPanel />
                <Goals.AchievementsPanel />
            </div>
            <Modal open={!!outlet} onClose={() => setOutletCache(null)} variant="full">
                {
                    outlet
                        ? <Outlet />
                        : (outletCache)
                }
            </Modal>
        </>
    )
}
