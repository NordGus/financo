import { LoaderFunction, LoaderFunctionArgs, useOutletContext } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";
import { QueryClient } from "@tanstack/react-query";

import Transaction from "@/types/Transaction";

import { ListFilters } from "@api/transactions";

import Transactions from "@routes/App/Ledger/Transactions";
import { Card, CardHeader, CardTitle } from "@components/ui/card";
import { TransactionsHistory } from "./history";

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

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Transactions</CardTitle>
                </CardHeader>
                <TransactionsHistory filters={filters} setOpen={setOpen} setTransaction={setTransaction} />
            </Card>
            <div className="grid grid-rows-[60dvh,_minmax(0,_1fr)] h-full max-h-[100dvh] grid-cols-3 gap-2">
                <Transactions.History
                    filters={filters} setOpen={setOpen} setTransaction={setTransaction}
                    className="row-span-2"
                />
                <Transactions.Upcoming filters={filters} setOpen={setOpen} setTransaction={setTransaction} />
                <Transactions.Pending filters={filters} setOpen={setOpen} setTransaction={setTransaction} />
            </div>
        </>
    )
}