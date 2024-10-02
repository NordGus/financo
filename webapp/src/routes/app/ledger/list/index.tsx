import { Transaction } from "@/types/Transaction";
import {
    getPendingTransactions,
    getTransactions,
    ListFilters,
    PendingFilters,
} from "@api/transactions";
import { useTransactionsFiltersCtx } from "@components/filters/use-transactions-filters";
import { Accordion } from "@components/ui/accordion";
import { Card } from "@components/ui/card";
import { useMutation } from "@tanstack/react-query";
import moment from "moment";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useLoaderData, useOutletContext } from "react-router-dom";
import { TransactionsHistory } from "./history";
import { loader } from "./loader";
import { TransactionsPending } from "./pending";
import { TransactionsUpcoming } from "./upcoming";

interface OutletContext {
    setOpen: Dispatch<SetStateAction<boolean>>
    setTransaction: Dispatch<SetStateAction<Transaction | NonNullable<unknown>>>
}

export default function Index() {
    const { setOpen, setTransaction } = useOutletContext<OutletContext>()
    const { timestamp } = useLoaderData() as Awaited<ReturnType<ReturnType<typeof loader>>>
    const { filters } = useTransactionsFiltersCtx()

    const pendingTransactions = useMutation({
        mutationKey: ['transactions', 'pending'],
        mutationFn: (data: PendingFilters) => getPendingTransactions(data)
    })

    const upcomingTransactions = useMutation({
        mutationKey: ['transactions', 'upcoming'],
        mutationFn: (data: ListFilters) => getTransactions(data)
    })

    const historyTransactions = useMutation({
        mutationKey: ["transactions", "history"],
        mutationFn: (data: ListFilters) => getTransactions(data)
    })

    useEffect(() => {
        pendingTransactions.mutate({
            account: filters.accounts,
            category: filters.categories
        })
    }, [filters, timestamp])

    useEffect(() => {
        upcomingTransactions.mutate({
            executedFrom: moment().add({ days: 1 }).toISOString(),
            executedUntil: moment().add({ month: 1 }).toISOString(),
            account: filters.accounts,
            category: filters.categories
        })
    }, [filters, timestamp])

    useEffect(() => {
        historyTransactions.mutate({
            executedFrom: filters.from?.toISOString(),
            executedUntil: filters.to?.toISOString(),
            account: filters.accounts,
            category: filters.categories
        })
    }, [filters, timestamp])

    return (
        <div className="flex flex-col">
            <Accordion type="multiple" className="flex flex-col">
                <TransactionsUpcoming
                    mutation={upcomingTransactions}
                    setOpen={setOpen}
                    setTransaction={setTransaction}
                />
                <TransactionsPending
                    mutation={pendingTransactions}
                    setOpen={setOpen}
                    setTransaction={setTransaction}
                />
            </Accordion>
            <Card>
                <TransactionsHistory
                    mutation={historyTransactions}
                    setOpen={setOpen}
                    setTransaction={setTransaction}
                />
            </Card>
        </div>
    )
}