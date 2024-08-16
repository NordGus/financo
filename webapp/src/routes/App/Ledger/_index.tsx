import { LoaderFunction, LoaderFunctionArgs, Outlet } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";
import { useReducer, useState } from "react";
import { isEqual } from "lodash";
import moment from "moment";
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
import Transactions from "./Transactions";
import { Filters } from "./filters";

function defaultFilters(): Filters {
    return {
        from: moment().subtract({ months: 1 }).toDate(),
        to: moment().toDate(),
        accounts: []
    }
}

export function loader(_queryClient: QueryClient): LoaderFunction {
    return async (_props: LoaderFunctionArgs) => {
        return { breadcrumb: "Ledger" }
    }
}

const actionTypes = {
    UPDATE_DATES: "UPDATE_DATES",
    ADD_ACCOUNT: "ADD_ACCOUNT",
    REMOVE_ACCOUNT: "REMOVE_ACCOUNT",
    CLEAR: "CLEAR"
} as const

type FiltersActionType = typeof actionTypes

export type Filters = { from: Date | undefined, to: Date | undefined, accounts: number[] }

export type FiltersState = { clearable: boolean, filters: Filters }

export type FiltersAction =
    | {
        type: FiltersActionType["UPDATE_DATES"]
        range: { from: Date | undefined, to: Date | undefined }
    }
    | {
        type: FiltersActionType["ADD_ACCOUNT"]
        id: number
    }
    | {
        type: FiltersActionType["REMOVE_ACCOUNT"]
        id: number
    }
    | {
        type: FiltersActionType["CLEAR"]
    }

function reducer(state: FiltersState, action: FiltersAction): FiltersState {
    switch (action.type) {
        case "UPDATE_DATES":
            return {
                clearable: true,
                filters: { ...state.filters, ...action.range }
            }
        case "ADD_ACCOUNT":
            return {
                clearable: true,
                filters: {
                    ...state.filters,
                    accounts: [...state.filters.accounts, action.id]
                }
            }
        case "REMOVE_ACCOUNT":
            return {
                clearable: true,
                filters: {
                    ...state.filters,
                    accounts: [...state.filters.accounts.filter((id) => id !== action.id)]
                }
            }
        case "CLEAR":
            return { clearable: false, filters: defaultFilters() }
    }
}

export default function Layout() {
    const [filters, dispatch] = useReducer(reducer, { clearable: false, filters: defaultFilters() })
    const [openForm, setOpenForm] = useState(false)
    const [openFilters, setOpenFilters] = useState(false)
    const [transaction, setTransaction] = useState<Transaction | {}>({})

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
                <Button className="p-2.5" variant={"outline"} onClick={() => setOpenFilters(true)}>
                    <SlidersHorizontalIcon />
                </Button>
                <Button
                    onClick={() => {
                        setTransaction({})
                        setOpenForm(true)
                    }}
                >
                    New
                </Button>
            </div>
            <Sheet open={openFilters} onOpenChange={setOpenFilters}>
                <SheetContent className="w-[400px] sm:w-[540px] sm:max-w-[540px] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Filter Transactions</SheetTitle>
                    </SheetHeader>
                    <Filters state={filters} dispatch={dispatch} />
                </SheetContent>
            </Sheet>
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
                    setOpen: setOpenForm,
                }}
            />
        </div>
    )
}