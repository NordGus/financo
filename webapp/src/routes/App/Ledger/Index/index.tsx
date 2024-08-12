import { LoaderFunction, LoaderFunctionArgs, useOutletContext } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";
import { QueryClient } from "@tanstack/react-query";

import Transaction from "@/types/Transaction";

import { ListFilters } from "@api/transactions";

import Transactions from "@routes/App/Ledger/Transactions";
import Chart from "@routes/App/Ledger/Chart";

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
    const outletContext = useOutletContext<OutletContext>()

    return (
        <div className="grid grid-rows-[60dvh,_minmax(0,_1fr)] h-full max-h-[100dvh] grid-cols-3 gap-2">
            <Transactions.History
                {...outletContext}
                className="row-span-2"
            />
            <Transactions.Upcoming {...outletContext} />
            <Transactions.Pending {...outletContext} />
            <Chart className="col-span-2" />
        </div>
    )
}