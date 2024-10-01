import { Outlet } from "react-router-dom";
import { useReducer, useState } from "react";
import { isEqual } from "lodash";
import { SlidersHorizontalIcon } from "lucide-react";

import Transaction from "@/types/Transaction";

import Breadcrumbs from "@components/breadcrumbs";
import { Button } from "@components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle
} from "@components/ui/sheet";
import Transactions from "./transactions";
import { reducer, defaultFilters, TransactionsFilters } from "@components/filters/transactions";

export default function Layout() {
    const [filters, dispatch] = useReducer(reducer, { clearable: false, filters: defaultFilters() })
    const [openForm, setOpenForm] = useState(false)
    const [openFilters, setOpenFilters] = useState(false)
    const [transaction, setTransaction] = useState<Transaction | NonNullable<unknown>>({})

    return (
        <div className="gap-4 flex flex-col">
            <div className="flex items-center gap-4">
                <Breadcrumbs />
                <span className="grow contents-['']"></span>
                {
                    filters.clearable && (
                        <Button variant="outline" onClick={() => { dispatch({ type: "CLEAR" }) }}>Clear Filters</Button>
                    )
                }
                <Button variant="secondary" onClick={() => setOpenFilters(true)}>
                    <SlidersHorizontalIcon className="mr-2 h-4 w-4" /> Filter
                </Button>
                <Button onClick={() => { setTransaction({}); setOpenForm(true); }}>New</Button>
            </div>
            <TransactionsFilters state={filters} dispatch={dispatch} open={openFilters} setOpen={setOpenFilters} />
            <Sheet open={openForm} onOpenChange={setOpenForm}>
                <SheetContent className="w-[400px] sm:w-[540px] sm:max-w-[540px] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>
                            {
                                isEqual(transaction, {})
                                    ? "Add Transaction"
                                    : "Edit Transaction"
                            }
                        </SheetTitle>
                    </SheetHeader>
                    <Transactions.Form transaction={transaction} setOpen={setOpenForm} />
                </SheetContent>
            </Sheet>
            <Outlet
                context={{
                    filters,
                    setTransaction,
                    setOpen: setOpenForm
                }}
            />
        </div>
    )
}