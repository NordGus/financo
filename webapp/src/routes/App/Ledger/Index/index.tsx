import { LoaderFunction, LoaderFunctionArgs, useOutletContext } from "react-router-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { QueryClient, useMutation } from "@tanstack/react-query";
import moment from "moment";

import Transaction from "@/types/Transaction";

import {
    getPendingTransactions,
    getTransactions,
    getUpcomingTransactions,
    ListFilters,
    PendingFilters,
    UpcomingFilters
} from "@api/transactions";

import { Card, CardHeader, CardTitle } from "@components/ui/card";
import { Accordion } from "@components/ui/accordion";
import { TransactionsHistory } from "./history";
import { TransactionsPending } from "./pending"
import { TransactionsUpcoming } from "./upcoming";

interface OutletContext {
    filters: ListFilters
    setOpen: Dispatch<SetStateAction<boolean>>
    setTransaction: Dispatch<SetStateAction<Transaction | {}>>
}

export function loader(_queryClient: QueryClient): LoaderFunction {
    return async (_props: LoaderFunctionArgs) => {
        return {}
    }
}

export default function Index() {
    const { filters, setOpen, setTransaction } = useOutletContext<OutletContext>()

    const pendingTransactions = useMutation({
        mutationKey: ['transactions', 'pending'],
        mutationFn: (filters: PendingFilters) => getPendingTransactions(filters)()
    })

    const upcomingTransactions = useMutation({
        mutationKey: ['transactions', 'upcoming'],
        mutationFn: (filters: UpcomingFilters) => getUpcomingTransactions(filters)()
    })

    const historyTransactions = useMutation({
        mutationKey: ["transactions", "history"],
        mutationFn: (filters: ListFilters) => getTransactions(filters)()
    })

    useEffect(() => pendingTransactions.mutate({ account: filters.account }), [filters])
    useEffect(() => {
        upcomingTransactions.mutate({
            executedUntil: moment().add({ month: 1 }).toISOString(), account: filters.account
        })
    }, [filters])
    useEffect(() => historyTransactions.mutate(filters), [filters])

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