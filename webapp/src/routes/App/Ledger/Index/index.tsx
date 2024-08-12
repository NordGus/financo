import { getTransactions, ListFilters } from "@api/transactions";
import Transactions from "../Transactions";
import moment from "moment";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { QueryClient, useMutation } from "@tanstack/react-query";
import Chart from "../Chart";
import { LoaderFunction, LoaderFunctionArgs, useOutletContext } from "react-router-dom";
import Transaction from "@/types/Transaction";

interface OutletContext {
    filters: ListFilters
    setOpen: Dispatch<SetStateAction<boolean>>
    setTransaction: Dispatch<SetStateAction<Transaction | {}>>
}

function defaultFilters(): ListFilters {
    return {
        executedFrom: moment().subtract({ months: 1 }).format('YYYY-MM-DD'),
        executedUntil: moment().format('YYYY-MM-DD'),
        account: []
    }
}

export function loader(_queryClient: QueryClient): LoaderFunction {
    return async (_props: LoaderFunctionArgs) => {
        return {}
    }
}

export default function Index() {
    const { filters, setTransaction, setOpen } = useOutletContext<OutletContext>()

    const transactionHistory = useMutation({
        mutationFn: (filters: ListFilters) => getTransactions(filters)()
    })

    useEffect(() => transactionHistory.mutate(filters), [])

    return (
        <div className="grid grid-rows-[60dvh,_minmax(0,_1fr)] h-full max-h-[100dvh] grid-cols-3 gap-2">
            <Transactions.History
                transactions={transactionHistory}
                className="row-span-2"
            />
            <Transactions.Upcoming />
            <Transactions.Pending />
            <Chart className="col-span-2" />
        </div>
    )
}