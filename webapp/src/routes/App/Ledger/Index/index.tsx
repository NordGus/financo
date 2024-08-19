import { LoaderFunctionArgs, useLoaderData, useOutletContext } from "react-router-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { QueryClient, useMutation } from "@tanstack/react-query";
import moment from "moment";

import Transaction from "@/types/Transaction";

import {
    getPendingTransactions,
    getTransactions,
    ListFilters,
    PendingFilters,
} from "@api/transactions";

import { Card } from "@components/ui/card";
import { Accordion } from "@components/ui/accordion";
import { TransactionsHistory } from "./history";
import { TransactionsPending } from "./pending"
import { TransactionsUpcoming } from "./upcoming";
import { FiltersState } from "@components/filters/transactions";

interface OutletContext {
    filters: FiltersState
    setOpen: Dispatch<SetStateAction<boolean>>
    setTransaction: Dispatch<SetStateAction<Transaction | {}>>
}

export const loader = (_queryClient: QueryClient) => async (_props: LoaderFunctionArgs) => {
    return { timestamp: moment().toISOString() }
}

export default function Index() {
    const { filters: { filters }, setOpen, setTransaction } = useOutletContext<OutletContext>()
    const { timestamp } = useLoaderData() as Awaited<ReturnType<ReturnType<typeof loader>>>

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
        pendingTransactions.mutate({ account: filters.accounts, category: filters.categories })
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
                    mutation={upcomingTransactions} setOpen={setOpen} setTransaction={setTransaction}
                />
                <TransactionsPending
                    mutation={pendingTransactions} setOpen={setOpen} setTransaction={setTransaction}
                />
            </Accordion>
            <Card>
                <TransactionsHistory
                    mutation={historyTransactions} setOpen={setOpen} setTransaction={setTransaction}
                />
            </Card>
        </div>
    )
}