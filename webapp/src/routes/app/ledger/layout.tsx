import { Transaction } from "@/types/Transaction";
import Breadcrumbs from "@components/breadcrumbs";
import * as TransactionsFilters from "@components/filters/transactions";
import { Button } from "@components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle
} from "@components/ui/sheet";
import { isEqual } from "lodash";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Transactions from "./transactions";

export default function Layout() {
    const [openForm, setOpenForm] = useState(false)
    const [transaction, setTransaction] = useState<Transaction | NonNullable<unknown>>({})

    return (
        <TransactionsFilters.Provider>
            <div className="gap-4 flex flex-col">
                <div className="flex items-center gap-4">
                    <Breadcrumbs />
                    <span className="grow contents-['']"></span>
                    <TransactionsFilters.Clear />
                    <TransactionsFilters.Filters />
                    <Button onClick={() => { setTransaction({}); setOpenForm(true); }}>New</Button>
                </div>
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
                        setTransaction,
                        setOpen: setOpenForm
                    }}
                />
            </div>
        </TransactionsFilters.Provider>
    )
}