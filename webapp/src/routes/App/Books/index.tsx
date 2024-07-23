import { Outlet, useNavigate, useOutlet } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import moment from "moment";

import { getTransactions, ListFilters } from "@api/transactions";

import Modal from "@components/Modal";
import Transactions from "./Transactions";
import Filters from "./Filters";
import Chart from "./Chart";

type Modals = "outlet" | "filter" | "none";

function defaultFilters(): ListFilters {
    return {
        executedFrom: moment().subtract({ months: 1 }).format('YYYY-MM-DD'),
        executedUntil: moment().format('YYYY-MM-DD'),
        account: []
    }
}

export default function Books() {
    const outlet = useOutlet()
    const navigate = useNavigate()
    const [openModal, setOpenModal] = useState(false)
    const [filters, setFilters] = useState<ListFilters>(defaultFilters())
    const [previousFilters, setPreviousFilters] = useState<ListFilters>(defaultFilters())
    const [modal, setModal] = useState<Modals>("none")

    const transactionHistory = useMutation({
        mutationFn: (filters: ListFilters) => {
            setOpenModal(false)

            return getTransactions(filters)();
        }
    })

    useEffect(() => {
        if (!!outlet) {
            setModal("outlet")
            setOpenModal(true)
        }
    }, [!!outlet])

    useEffect(() => { if (!outlet && openModal) setModal("filter") }, [openModal])

    useEffect(() => transactionHistory.mutate(filters), [])

    return (
        <>
            <div className="grid grid-rows-[60dvh,_minmax(0,_1fr)] h-full grid-cols-3 gap-2">
                <Transactions.History
                    showFilters={openModal}
                    setShowFilters={setOpenModal}
                    transactions={transactionHistory}
                    className="row-span-2"
                />
                <Transactions.Upcoming />
                <Transactions.Pending />
                <Chart className="col-span-2" />
            </div>
            <Modal
                open={openModal}
                onClose={() => {
                    setModal("none")
                    if (!!outlet) navigate("/books")
                }}
            >
                {
                    {
                        ["outlet"]: <Outlet context={{ setOpenModal }} />,
                        ["filter"]: <Filters
                            filters={filters}
                            setFilters={setFilters}
                            onClose={() => {
                                setFilters(previousFilters)
                                setOpenModal(false)
                            }}
                            onApplyFilters={() => {
                                setPreviousFilters(filters)
                                transactionHistory.mutate(filters)
                            }}
                            onClearFilters={() => {
                                setFilters(defaultFilters())
                                setPreviousFilters(defaultFilters())

                                transactionHistory.mutate(defaultFilters())
                            }}
                        />,
                        ["none"]: null
                    }[modal]
                }
            </Modal>
        </>
    )
}