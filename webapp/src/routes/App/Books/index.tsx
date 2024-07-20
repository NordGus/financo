import { Outlet, useOutlet } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import moment from "moment";

import { getTransactions, ListFilters } from "@api/transactions";

import Modal from "@components/Modal";
import Transactions from "./Transactions";
import Chart from "./Chart";

type ModalStyles = "outlet" | "history" | "upcoming" | "none";

function defaultHistoryFilters(): ListFilters {
    return {
        executedFrom: moment().subtract({ months: 1 }).format('YYYY-MM-DD'),
        executedUntil: moment().format('YYYY-MM-DD')
    }
}

export default function Books() {
    const outlet = useOutlet()
    const [outletCache, setOutletCache] = useState(outlet)
    const [modalFor, setModalFor] = useState<ModalStyles>("none")
    const [showHistoryFilters, setShowHistoryFilters] = useState(false)
    const [showUpcomingFilters, setShowUpcomingFilters] = useState(false)
    const [historyFilters, setHistoryFilters] = useState<ListFilters>(defaultHistoryFilters())

    const historyMutation = useMutation({
        mutationFn: (filters: ListFilters) => getTransactions(filters)()
    })

    useEffect(() => {
        if (outlet && !outletCache) setOutletCache(outlet)
    }, [outlet, outletCache])

    useEffect(() => {
        if (outlet && modalFor !== "outlet")
            setModalFor("outlet")
        else if (showHistoryFilters && modalFor !== "history")
            setModalFor("history")
        else if (showUpcomingFilters && modalFor !== "upcoming")
            setModalFor("upcoming")
        else if (!outlet && !showHistoryFilters && !showUpcomingFilters && modalFor !== "none")
            setModalFor("none")
    }, [outlet, showHistoryFilters, showUpcomingFilters])

    useEffect(() => historyMutation.mutate(historyFilters), [historyFilters])

    return (
        <>
            <div className="grid grid-rows-[60dvh,_minmax(0,_1fr)] h-full grid-cols-3 gap-1">
                <Transactions.History
                    showFilters={showHistoryFilters}
                    setShowFilters={setShowHistoryFilters}
                    filters={historyMutation}
                    className="row-span-2"
                />
                <Transactions.Upcoming className="" />
                <Transactions.Pending className="" />
                <Chart className="col-span-2" />
            </div>
            <Modal
                open={modalFor !== "none"}
                onClose={() => {
                    setOutletCache(null)
                }}
                variant="small"
                bodyClassName="h-[75dvh]"
            >
                {
                    modalFor === "outlet" && (outlet ? <Outlet /> : (outletCache))
                }
                {
                    modalFor === "history" && (
                        <h1 className="text-2xl text-neutral-50">History Modal Filters</h1>
                    )
                }
                {
                    modalFor === "upcoming" && (
                        <h1 className="text-2xl text-neutral-50">Upcoming Modal Filters</h1>
                    )
                }
            </Modal>
        </>
    )
}