import { LoaderFunction, LoaderFunctionArgs, Outlet } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { isEqual } from "lodash";
import moment from "moment";
import { CalendarIcon } from "lucide-react";

import Transaction from "@/types/Transaction";

import { ListFilters } from "@api/transactions";
import { cn } from "@/lib/utils";

import Breadcrumbs from "@components/breadcrumbs";
import { Button } from "@components/ui/button";
import { Calendar } from "@components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@components/ui/popover";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@components/ui/sheet";
import Transactions from "./Transactions";

function defaultFilters(): ListFilters {
    return {
        executedFrom: moment().subtract({ months: 1 }).format('YYYY-MM-DD'),
        executedUntil: moment().format('YYYY-MM-DD'),
        account: []
    }
}

export function loader(_queryClient: QueryClient): LoaderFunction {
    return async (_props: LoaderFunctionArgs) => {
        return { breadcrumb: "Ledger" }
    }
}

export default function Layout() {
    const [openSheet, setOpenSheet] = useState(false)
    const [filters, setFilters] = useState<ListFilters>(defaultFilters())
    const [clearable, setClearable] = useState(false)
    const [date, setDate] = useState<DateRange | undefined>({
        from: moment(filters.executedFrom).toDate(),
        to: moment(filters.executedUntil).toDate()
    })
    const [transaction, setTransaction] = useState<Transaction | {}>({})

    return (
        <div className="gap-4 flex flex-col">
            <div className="flex items-center gap-4">
                <Breadcrumbs />
                <span className="grow contents-['']"></span>
                {
                    clearable && <Button
                        variant="outline"
                        onClick={() => {
                            setDate({
                                from: moment(defaultFilters().executedFrom).toDate(),
                                to: moment(defaultFilters().executedUntil).toDate()
                            })
                            setFilters(defaultFilters())
                            setClearable(false)
                        }}
                    >
                        Clear Filters
                    </Button>
                }
                <Popover>
                    <PopoverTrigger asChild={true}>
                        <Button
                            id="date"
                            variant="outline"
                            className={cn(
                                "min-w-[10rem] justify-start text-left font-normal",
                                !date && "text-zinc-500"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, "LLL dd, y")} -{" "}
                                        {format(date.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(date.from, "LLL dd, y")
                                )
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus={true}
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={(value) => {
                                setDate(value)
                                setFilters({
                                    ...filters,
                                    executedFrom: value?.from?.toISOString(),
                                    executedUntil: value?.to?.toISOString(),
                                })
                                setClearable(true)
                            }}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
                <Sheet open={openSheet} onOpenChange={setOpenSheet}>
                    <SheetTrigger asChild={true}>
                        <Button
                            onClick={() => {
                                setTransaction({})
                                setOpenSheet(true)
                            }}
                        >
                            New
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[400px] sm:w-[540px] sm:max-w-[540px]">
                        <SheetHeader>
                            <SheetTitle>
                                {
                                    isEqual(transaction, {})
                                        ? "Add Transaction"
                                        : "Edit Transaction"
                                }
                            </SheetTitle>
                        </SheetHeader>
                        {
                            (isEqual(transaction, {}))
                                ? <Transactions.Create
                                    transaction={{}}
                                    setOpen={setOpenSheet}
                                />
                                : <Transactions.Update
                                    transaction={transaction as Transaction}
                                    setOpen={setOpenSheet}
                                />
                        }
                    </SheetContent>
                </Sheet>
            </div>
            <Outlet
                context={{
                    filters,
                    setTransaction,
                    setOpen: setOpenSheet,
                }}
            />
        </div>
    )
}