import { Outlet, useNavigate, useOutlet } from "react-router-dom"
import { useEffect, useState } from "react"

import Modal from "@components/Modal"

import Summary from "./Summary"
import Goals from "./Goals"
import CapitalAccounts from "./CapitalAccounts"
import DebtAccounts from "./DebtAccounts"
import ExternalAccounts from "./ExternalAccounts"

export default function AccountsAndGoals() {
    const outlet = useOutlet()
    const navigate = useNavigate()
    const [openModal, setOpenModal] = useState(false)

    useEffect(() => {
        if (!!outlet !== openModal && !openModal) setOpenModal(true)
    }, [!!outlet])

    return (
        <>
            <div
                className="grid grid-cols-4 grid-rows-[min-content_minmax(0,_1fr)_minmax(0,_1fr)] gap-2 h-full"
            >
                <Summary.Capital />
                <Summary.Debts />
                <Summary.Total />
                <div></div>
                <CapitalAccounts.Normal />
                <DebtAccounts.Loan />
                <ExternalAccounts.Income />
                <Goals.Administration />
                <CapitalAccounts.Savings />
                <DebtAccounts.CreditLine />
                <ExternalAccounts.Expense />
                <Goals.Achievements />
            </div>
            <Modal
                open={openModal}
                onClose={() => navigate("/accounts")}
            >
                <Outlet context={{ setOpenModal }} />
            </Modal>
        </>
    )
}
