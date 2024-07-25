import { useState } from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { isEmpty, isNil } from "lodash";
import { DateRange } from "react-day-picker";

import { Kind, Preview } from "@/types/Account";

import { isExpenseAccount, isIncomeAccount } from "@helpers/account/isExternalAccount";
import isCapitalAccount from "@helpers/account/isCapitalAccount";
import isDebtAccount from "@helpers/account/isDebtAccount";

import { ListFilters } from "@api/transactions";
import { accountsForOtherContext } from "@queries/accounts";

import Throbber from "@components/Throbber";
import { Calendar } from "@components/ui/calendar";
import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import { ScrollArea } from "@components/ui/scroll-area";
import { Separator } from "@components/ui/separator";
import { Checkbox } from "@components/ui/checkbox";

interface Props {
    filters: ListFilters,
    setFilters: React.Dispatch<React.SetStateAction<ListFilters>>,
    onClose: React.MouseEventHandler<HTMLSpanElement>,
    onApplyFilters: () => void,
    onClearFilters: () => void
}

function AccountsFor({
    text,
    query: { isFetching, data },
    filters: { executedFrom, executedUntil, account: selected = [] },
    setFilters,
    kindFn: kindFn
}: {
    text: string
    query: UseQueryResult<Preview[], Error>
    filters: ListFilters,
    setFilters: React.Dispatch<React.SetStateAction<ListFilters>>,
    kindFn: (kind: Kind) => boolean,
}) {
    return (
        <Card>
            <ScrollArea>
                <span className="block p-4">
                    <h3 className="mb-4 font-medium leading-none flex gap-1 items-center">
                        {isFetching && <Throbber variant="small" />} {text}
                    </h3>
                    {
                        (isEmpty(data) || isNil(data))
                            ? null
                            : data.filter(({ kind }) => kindFn(kind)).map((acc, idx, accs) => <>
                                <div
                                    key={`account:filter:${acc.id}`}
                                    style={{ color: acc.color }}
                                    className="flex items-center space-x-2 py-2"
                                >
                                    <Checkbox
                                        id={`account:filter:${acc.id}`}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setFilters({
                                                    executedFrom,
                                                    executedUntil,
                                                    account: [...selected, acc.id]
                                                })
                                            } else {
                                                setFilters({
                                                    executedFrom,
                                                    executedUntil,
                                                    account: [
                                                        ...selected.filter((id) => id !== acc.id)
                                                    ]
                                                })
                                            }
                                        }}
                                        checked={selected.includes(acc.id)}
                                    />
                                    <label
                                        htmlFor={`account:filter:${acc.id}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 hover:cursor-a"
                                    >
                                        {acc.name}
                                    </label>
                                </div>
                                {idx !== accs.length - 1 && <Separator
                                    key={`account:separator:${acc.id}`}
                                />}
                            </>)
                    }
                </span>
            </ScrollArea>
        </Card>
    )
}

export default function Filters({
    filters,
    setFilters,
    onClose,
    onApplyFilters,
    onClearFilters
}: Props) {
    const accountsQuery = useQuery(accountsForOtherContext)
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: isNil(filters.executedFrom) ? undefined : new Date(filters.executedFrom),
        to: isNil(filters.executedUntil) ? undefined : new Date(filters.executedUntil)
    })

    return (
        <div className="h-full flex flex-col-reverse items-center">
            <div
                className="mt-auto grid grid-rows-[minmax(0,_min-content)_minmax(0,_1fr)] gap-2"
            >
                <div className="flex items-stretch min-h-10 h-10 max-h-10 gap-2">
                    <Button variant='secondary' onClick={onClose}>
                        Close
                    </Button>
                    <span className="contents-[''] flex-grow"></span>
                    <Button variant="link" onClick={onClearFilters}>
                        Clear
                    </Button>
                    <Button onClick={onApplyFilters}>
                        Apply
                    </Button>
                </div>
                <div className="grid grid-cols-[min-content_minmax(0,_1fr)_minmax(0,_1fr)_minmax(0,_1fr)_minmax(0,_1fr)] items-stretch gap-2">
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex gap-2">
                            {/* TODO(#1): implement date picker period shortcut */}
                            <Button variant="link">
                                Today
                            </Button>
                            <Button variant="link">
                                Week
                            </Button>
                            <Button variant="link">
                                Month
                            </Button>
                            <Button variant="link">
                                Year
                            </Button>
                            <Button variant="link">
                                Forever
                            </Button>
                        </div>
                        <Card>
                            <Calendar
                                mode="range"
                                numberOfMonths={2}
                                selected={dateRange}
                                onSelect={setDateRange}
                            />
                        </Card>
                    </div>
                    <AccountsFor
                        key={"capital_filter"}
                        text="Capital"
                        query={accountsQuery}
                        filters={filters}
                        setFilters={setFilters}
                        kindFn={isCapitalAccount}
                    />
                    <AccountsFor
                        key={"debts_filter"}
                        text="Debts"
                        query={accountsQuery}
                        filters={filters}
                        setFilters={setFilters}
                        kindFn={isDebtAccount}
                    />
                    <AccountsFor
                        key={"income_filter"}
                        text="Income"
                        query={accountsQuery}
                        filters={filters}
                        setFilters={setFilters}
                        kindFn={isIncomeAccount}
                    />
                    <AccountsFor
                        key={"expense_filter"}
                        text="Expense"
                        query={accountsQuery}
                        filters={filters}
                        setFilters={setFilters}
                        kindFn={isExpenseAccount}
                    />
                </div>
            </div>
        </div>
    )
}