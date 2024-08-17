import { LoaderFunction, LoaderFunctionArgs, useOutletContext } from "react-router-dom";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { QueryClient, useMutation } from "@tanstack/react-query";
import moment from "moment";

import Transaction from "@/types/Transaction";

import {
    getPendingTransactions,
    getTransactions,
    ListFilters,
    PendingFilters,
} from "@api/transactions";

import { Card, CardHeader, CardTitle } from "@components/ui/card";
import { Accordion } from "@components/ui/accordion";
import { TransactionsHistory } from "./history";
import { TransactionsPending } from "./pending"
import { TransactionsUpcoming } from "./upcoming";
import { FiltersState } from "@components/filters/transactions";

interface OutletContext {
    filters: FiltersState
    setOpen: Dispatch<SetStateAction<boolean>>
    setTransaction: Dispatch<SetStateAction<Transaction | {}>>
    reload: string
}

export function loader(_queryClient: QueryClient): LoaderFunction {
    return async (_props: LoaderFunctionArgs) => {
        return {}
    }
}

export default function Index() {
    const { filters: { filters }, setOpen, setTransaction, reload } = useOutletContext<OutletContext>()

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
        pendingTransactions.mutate({ account: filters.accounts })
    }, [filters, reload])

    useEffect(() => {
        upcomingTransactions.mutate({
            executedFrom: moment().add({ days: 1 }).toISOString(),
            executedUntil: moment().add({ month: 1 }).toISOString(),
            account: filters.accounts
        })
    }, [filters, reload])

    useEffect(() => {
        historyTransactions.mutate({
            executedFrom: filters.from?.toISOString(),
            executedUntil: filters.to?.toISOString(),
            account: filters.accounts
        })
    }, [filters, reload])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Transactions</CardTitle>
            </CardHeader>
            <Accordion type="multiple">
                <TransactionsUpcoming
                    mutation={upcomingTransactions} setOpen={setOpen} setTransaction={setTransaction}
                />
                <TransactionsPending
                    mutation={pendingTransactions} setOpen={setOpen} setTransaction={setTransaction}
                />
            </Accordion>
            <TransactionsHistory
                mutation={historyTransactions} setOpen={setOpen} setTransaction={setTransaction}
            />
        </Card>
    )
}