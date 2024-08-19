import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Calendar } from "@components/ui/calendar"
import { useQuery } from "@tanstack/react-query"
import { staleTimeDefault } from "@queries/Client"
import { getArchivedSelectableAccounts, getSelectableAccounts } from "@api/accounts"
import { Throbber } from "@components/Throbber"
import { isEmpty, isNil } from "lodash"
import { Kind, Select } from "@/types/Account"
import { accountContrastColor } from "@helpers/account/accountContrastColor"
import { DateRange } from "react-day-picker"
import moment from "moment"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@components/ui/accordion"

const actionTypes = {
    UPDATE_DATES: "UPDATE_DATES",
    ADD_ACCOUNTS: "ADD_ACCOUNTS",
    REMOVE_ACCOUNTS: "REMOVE_ACCOUNTS",
    ADD_CATEGORIES: "ADD_CATEGORIES",
    REMOVE_CATEGORIES: "REMOVE_CATEGORIES",
    CLEAR: "CLEAR"
} as const

export type FiltersActionType = typeof actionTypes

export type Filters = { from: Date | undefined, to: Date | undefined, accounts: number[], categories: number[] }

export type FiltersState = { clearable: boolean, filters: Filters }

export type FiltersAction =
    | {
        type: FiltersActionType["UPDATE_DATES"]
        range: DateRange
    }
    | {
        type: FiltersActionType["ADD_ACCOUNTS"]
        ids: number[]
    }
    | {
        type: FiltersActionType["REMOVE_ACCOUNTS"]
        ids: number[]
    }
    | {
        type: FiltersActionType["ADD_CATEGORIES"]
        ids: number[]
    }
    | {
        type: FiltersActionType["REMOVE_CATEGORIES"]
        ids: number[]
    }
    | {
        type: FiltersActionType["CLEAR"]
    }

export function defaultFilters(): Filters {
    return {
        from: moment().startOf('month').toDate(),
        to: moment().toDate(),
        accounts: [],
        categories: []
    }
}

export function reducer(state: FiltersState, action: FiltersAction): FiltersState {
    switch (action.type) {
        case "UPDATE_DATES":
            return {
                clearable: true,
                filters: { ...state.filters, ...action.range }
            }
        case "ADD_ACCOUNTS":
            return {
                clearable: true,
                filters: {
                    ...state.filters,
                    accounts: [...state.filters.accounts, ...action.ids]
                }
            }
        case "REMOVE_ACCOUNTS":
            return {
                clearable: true,
                filters: {
                    ...state.filters,
                    accounts: [...state.filters.accounts.filter((id) => !action.ids.includes(id))]
                }
            }
        case "ADD_CATEGORIES":
            return {
                clearable: true,
                filters: {
                    ...state.filters,
                    categories: [...state.filters.categories, ...action.ids]
                }
            }
        case "REMOVE_CATEGORIES":
            return {
                clearable: true,
                filters: {
                    ...state.filters,
                    categories: [...state.filters.categories.filter((id) => !action.ids.includes(id))]
                }
            }
        case "CLEAR":
            return { clearable: false, filters: defaultFilters() }
    }
}

interface Props {
    state: FiltersState
    dispatch: Dispatch<FiltersAction>
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    excludeAccountIds?: number[]
}

export function TransactionsFilters({ state, dispatch, open, setOpen, excludeAccountIds: excluded = [] }: Props) {
    const [range, setRange] = useState<DateRange | undefined>({ from: state.filters.from, to: state.filters.to })
    const { data: accounts, isFetching, isError, error } = useQuery({
        queryKey: ["accounts", "select"],
        queryFn: getSelectableAccounts,
        staleTime: staleTimeDefault,
    })
    const {
        data: archived, isFetching: isFetchingArchived, isError: isErrorArchived, error: archivedError
    } = useQuery({
        queryKey: ["accounts", "select", "archived"],
        queryFn: getArchivedSelectableAccounts,
        staleTime: staleTimeDefault,
    })

    useEffect(() => {
        if (state.filters.from === range?.from && state.filters.to === range?.to) return

        dispatch({ type: "UPDATE_DATES", range: range ?? { from: undefined, to: undefined } })
    }, [range])

    useEffect(() => {
        if (state.filters.from === range?.from && state.filters.to === range?.to) return

        setRange({ from: state.filters.from, to: state.filters.to })
    }, [state.filters.from, state.filters.to])

    if (isError) throw error
    if (isErrorArchived) throw archivedError

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className="sm:w-fit sm:max-w-[600px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Filter Transactions</SheetTitle>
                </SheetHeader>
                <div className="text-zinc-950 dark:text-zinc-50 py-4 flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">Date</h3>
                    <Calendar
                        mode="range"
                        selected={range}
                        onSelect={setRange}
                        numberOfMonths={2}
                    />
                    <Accordion
                        type="multiple"
                        className="flex flex-col gap-2"
                        defaultValue={["accounts", "categories"]}
                    >
                        {
                            isFetching
                                ? <div className="flex justify-center items-center gap-2">
                                    <Throbber variant="small" />
                                    <span>Fetching</span>
                                </div>
                                : <>
                                    <AccountsFilter
                                        accounts={(accounts || []).filter(({ id }) => !excluded.includes(id))}
                                        state={state}
                                        dispatch={dispatch}
                                    />
                                    <CategoriesFilter
                                        accounts={(accounts || []).filter(({ id }) => !excluded.includes(id))}
                                        state={state}
                                        dispatch={dispatch}
                                    />
                                </>

                        }
                        {
                            isFetchingArchived
                                ? <div className="flex justify-center items-center gap-2">
                                    <Throbber variant="small" />
                                    <span>Fetching</span>
                                </div>
                                : <>
                                    <ArchivedAccountsFilter
                                        accounts={(archived || []).filter(({ id }) => !excluded.includes(id))}
                                        state={state}
                                        dispatch={dispatch}
                                    />
                                    <ArchivedCategoryFilter
                                        accounts={(archived || []).filter(({ id }) => !excluded.includes(id))}
                                        state={state}
                                        dispatch={dispatch}
                                    />
                                </>
                        }
                    </Accordion>
                </div>
            </SheetContent>
        </Sheet>
    )
}

interface AccountsProps {
    accounts: Select[] | undefined
    state: FiltersState
    dispatch: Dispatch<FiltersAction>
}

function AccountsFilter({ accounts, state: { filters }, dispatch }: AccountsProps) {
    if (isNil(accounts) || isEmpty(accounts)) return null

    const capital = accounts.filter(({ kind }) => kind === Kind.CapitalNormal)
    const savings = accounts.filter(({ kind }) => kind === Kind.CapitalSavings)
    const loans = accounts.filter(({ kind }) => [Kind.DebtLoan, Kind.DebtPersonal].includes(kind))
    const credit = accounts.filter(({ kind }) => kind === Kind.DebtCredit)

    const onClick = (acc: Select, active: boolean) => () => {
        if (active) {
            dispatch({
                type: "REMOVE_ACCOUNTS",
                ids: [acc.id, ...(acc.children || []).map(({ id }) => id)]
            })
        } else {
            dispatch({
                type: "ADD_ACCOUNTS",
                ids: [acc.id, ...(acc.children || []).map(({ id }) => id)]
            })
        }
    }

    return (
        <AccordionItem value="accounts">
            <AccordionTrigger className="text-lg">Accounts</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2 text-base">
                {
                    !isEmpty(capital) && (
                        <>
                            <h3>Bank, Cash or Equity</h3>
                            <div className="flex flex-wrap gap-2">
                                {
                                    capital.map((acc) => {
                                        const active = !isNil(filters.accounts.find((id) => id === acc.id))

                                        return (
                                            <AccountFilter
                                                key={`account:filter:${acc.id}`}
                                                account={acc}
                                                active={active}
                                                onClick={onClick(acc, active)}
                                            />
                                        )
                                    })
                                }
                            </div>
                        </>
                    )
                }
                {
                    !isEmpty(savings) && (
                        <>
                            <h3>Savings</h3>
                            <div className="flex flex-wrap gap-2">
                                {
                                    savings.map((acc) => {
                                        const active = !isNil(filters.accounts.find((id) => id === acc.id))

                                        return (
                                            <AccountFilter
                                                key={`account:filter:${acc.id}`}
                                                account={acc}
                                                active={active}
                                                onClick={onClick(acc, active)}
                                            />
                                        )
                                    })
                                }
                            </div>
                        </>
                    )
                }
                {
                    !isEmpty(loans) && (
                        <>
                            <h3>Loans</h3>
                            <div className="flex flex-wrap gap-2">
                                {
                                    loans.map((acc) => {
                                        const active = !isNil(filters.accounts.find((id) => id === acc.id))

                                        return (
                                            <AccountFilter
                                                key={`account:filter:${acc.id}`}
                                                account={acc}
                                                active={active}
                                                onClick={onClick(acc, active)}
                                            />
                                        )
                                    })
                                }
                            </div>
                        </>
                    )
                }
                {
                    !isEmpty(credit) && (
                        <>
                            <h3>Credit Lines</h3>
                            <div className="flex flex-wrap gap-2">
                                {
                                    credit.map((acc) => {
                                        const active = !isNil(filters.accounts.find((id) => id === acc.id))

                                        return (
                                            <AccountFilter
                                                key={`account:filter:${acc.id}`}
                                                account={acc}
                                                active={active}
                                                onClick={onClick(acc, active)}
                                            />
                                        )
                                    })
                                }
                            </div>
                        </>
                    )
                }
            </AccordionContent>
        </AccordionItem>
    )
}

function ArchivedAccountsFilter({ accounts, state: { filters }, dispatch }: AccountsProps) {
    if (isNil(accounts) || isEmpty(accounts)) return null

    const capital = accounts.filter(({ kind }) => kind === Kind.CapitalNormal)
    const savings = accounts.filter(({ kind }) => kind === Kind.CapitalSavings)
    const loans = accounts.filter(({ kind }) => [Kind.DebtLoan, Kind.DebtPersonal].includes(kind))
    const credit = accounts.filter(({ kind }) => kind === Kind.DebtCredit)

    const onClick = (acc: Select, active: boolean) => () => {
        if (active) {
            dispatch({
                type: "REMOVE_ACCOUNTS",
                ids: [acc.id, ...(acc.children || []).map(({ id }) => id)]
            })
        } else {
            dispatch({
                type: "ADD_ACCOUNTS",
                ids: [acc.id, ...(acc.children || []).map(({ id }) => id)]
            })
        }
    }

    return (
        <AccordionItem value="archived-accounts">
            <AccordionTrigger className="text-lg">Archived Accounts</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2 text-base">
                {
                    !isEmpty(capital) && (
                        <>
                            <h3>Bank, Cash or Equity</h3>
                            <div className="flex flex-wrap gap-2">
                                {
                                    capital.map((acc) => {
                                        const active = !isNil(filters.accounts.find((id) => id === acc.id))

                                        return (
                                            <AccountFilter
                                                key={`account:filter:${acc.id}`}
                                                account={acc}
                                                active={active}
                                                onClick={onClick(acc, active)}
                                            />
                                        )
                                    })
                                }
                            </div>
                        </>
                    )
                }
                {
                    !isEmpty(savings) && (
                        <>
                            <h3>Savings</h3>
                            <div className="flex flex-wrap gap-2">
                                {
                                    savings.map((acc) => {
                                        const active = !isNil(filters.accounts.find((id) => id === acc.id))

                                        return (
                                            <AccountFilter
                                                key={`account:filter:${acc.id}`}
                                                account={acc}
                                                active={active}
                                                onClick={onClick(acc, active)}
                                            />
                                        )
                                    })
                                }
                            </div>
                        </>
                    )
                }
                {
                    !isEmpty(loans) && (
                        <>
                            <h3>Loans</h3>
                            <div className="flex flex-wrap gap-2">
                                {
                                    loans.map((acc) => {
                                        const active = !isNil(filters.accounts.find((id) => id === acc.id))

                                        return (
                                            <AccountFilter
                                                key={`account:filter:${acc.id}`}
                                                account={acc}
                                                active={active}
                                                onClick={onClick(acc, active)}
                                            />
                                        )
                                    })
                                }
                            </div>
                        </>
                    )
                }
                {
                    !isEmpty(credit) && (
                        <>
                            <h3>Credit Lines</h3>
                            <div className="flex flex-wrap gap-2">
                                {
                                    credit.map((acc) => {
                                        const active = !isNil(filters.accounts.find((id) => id === acc.id))

                                        return (
                                            <AccountFilter
                                                key={`account:filter:${acc.id}`}
                                                account={acc}
                                                active={active}
                                                onClick={onClick(acc, active)}
                                            />
                                        )
                                    })
                                }
                            </div>
                        </>
                    )
                }
            </AccordionContent>
        </AccordionItem>
    )
}

interface AccountProps {
    account: Select
    active: boolean
    onClick: () => void
}

function AccountFilter({ account: { name, color }, active, onClick }: AccountProps) {
    return (
        <span
            className="rounded-lg border px-2 py-1 cursor-pointer flex items-center gap-2"
            style={{
                backgroundColor: active ? color : "transparent",
                color: active ? accountContrastColor(color) : color,
                borderColor: color
            }}
            onClick={onClick}
        >
            <span>{name}</span>
        </span>
    )
}

function CategoriesFilter({ accounts, state: { filters }, dispatch }: AccountsProps) {
    if (isNil(accounts) || isEmpty(accounts)) return null

    const loans = accounts.filter(({ kind }) => [Kind.DebtLoan, Kind.DebtPersonal].includes(kind))
    const credit = accounts.filter(({ kind }) => kind === Kind.DebtCredit)
    const income = accounts.filter(({ kind }) => kind === Kind.ExternalIncome)
    const expenses = accounts.filter(({ kind }) => kind === Kind.ExternalExpense)

    const onClick = (acc: Select, active: boolean) => () => {
        if (active) {
            dispatch({
                type: "REMOVE_CATEGORIES",
                ids: [acc.id, ...(acc.children || []).map(({ id }) => id)]
            })
        } else {
            dispatch({
                type: "ADD_CATEGORIES",
                ids: [acc.id, ...(acc.children || []).map(({ id }) => id)]
            })
        }
    }

    return (
        <AccordionItem value="categories">
            <AccordionTrigger className="text-lg">Categories</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2 text-base">
                {
                    !isEmpty(loans) && (
                        <>
                            <h3>Loans</h3>
                            <div className="flex flex-wrap gap-2">
                                {
                                    loans.map((acc) => {
                                        const active = !isNil(filters.categories.find((id) => id === acc.id))

                                        return (
                                            <CategoryFilter
                                                key={`account:filter:${acc.id}`}
                                                account={acc}
                                                active={active}
                                                onClick={onClick(acc, active)}
                                            />
                                        )
                                    })
                                }
                            </div>
                        </>
                    )
                }
                {
                    !isEmpty(credit) && (
                        <>
                            <h3>Credit Lines</h3>
                            <div className="flex flex-wrap gap-2">
                                {
                                    credit.map((acc) => {
                                        const active = !isNil(filters.categories.find((id) => id === acc.id))

                                        return (
                                            <CategoryFilter
                                                key={`account:filter:${acc.id}`}
                                                account={acc}
                                                active={active}
                                                onClick={onClick(acc, active)}
                                            />
                                        )
                                    })
                                }
                            </div>
                        </>
                    )
                }
                {
                    !isEmpty(income) && (
                        <>
                            <h3>Income</h3>
                            <div className="flex flex-wrap gap-2">
                                {
                                    income.map((acc) => {
                                        const active = !isNil(filters.categories.find((id) => id === acc.id))

                                        return (
                                            <CategoryFilter
                                                key={`account:filter:${acc.id}`}
                                                account={acc}
                                                active={active}
                                                onClick={onClick(acc, active)}
                                            />
                                        )
                                    })
                                }
                            </div>
                        </>
                    )
                }
                {
                    !isEmpty(expenses) && (
                        <>
                            <h3>Credit Lines</h3>
                            <div className="flex flex-wrap gap-2">
                                {
                                    expenses.map((acc) => {
                                        const active = !isNil(filters.categories.find((id) => id === acc.id))

                                        return (
                                            <CategoryFilter
                                                key={`account:filter:${acc.id}`}
                                                account={acc}
                                                active={active}
                                                onClick={onClick(acc, active)}
                                            />
                                        )
                                    })
                                }
                            </div>
                        </>
                    )
                }
            </AccordionContent>
        </AccordionItem>
    )
}

function ArchivedCategoryFilter({ accounts, state: { filters }, dispatch }: AccountsProps) {
    if (isNil(accounts) || isEmpty(accounts)) return null

    const loans = accounts.filter(({ kind }) => [Kind.DebtLoan, Kind.DebtPersonal].includes(kind))
    const credit = accounts.filter(({ kind }) => kind === Kind.DebtCredit)
    const income = accounts.filter(({ kind }) => kind === Kind.ExternalIncome)
    const expenses = accounts.filter(({ kind }) => kind === Kind.ExternalExpense)

    const onClick = (acc: Select, active: boolean) => () => {
        if (active) {
            dispatch({
                type: "REMOVE_CATEGORIES",
                ids: [acc.id, ...(acc.children || []).map(({ id }) => id)]
            })
        } else {
            dispatch({
                type: "ADD_CATEGORIES",
                ids: [acc.id, ...(acc.children || []).map(({ id }) => id)]
            })
        }
    }

    return (
        <AccordionItem value="archived-categories">
            <AccordionTrigger className="text-lg">Archived Categories</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2 text-base">
                {
                    !isEmpty(loans) && (
                        <>
                            <h3>Loans</h3>
                            <div className="flex flex-wrap gap-2">
                                {
                                    loans.map((acc) => {
                                        const active = !isNil(filters.categories.find((id) => id === acc.id))

                                        return (
                                            <CategoryFilter
                                                key={`account:filter:${acc.id}`}
                                                account={acc}
                                                active={active}
                                                onClick={onClick(acc, active)}
                                            />
                                        )
                                    })
                                }
                            </div>
                        </>
                    )
                }
                {
                    !isEmpty(credit) && (
                        <>
                            <h3>Credit Lines</h3>
                            <div className="flex flex-wrap gap-2">
                                {
                                    credit.map((acc) => {
                                        const active = !isNil(filters.categories.find((id) => id === acc.id))

                                        return (
                                            <CategoryFilter
                                                key={`account:filter:${acc.id}`}
                                                account={acc}
                                                active={active}
                                                onClick={onClick(acc, active)}
                                            />
                                        )
                                    })
                                }
                            </div>
                        </>
                    )
                }
                {
                    !isEmpty(income) && (
                        <>
                            <h3>Income</h3>
                            <div className="flex flex-wrap gap-2">
                                {
                                    income.map((acc) => {
                                        const active = !isNil(filters.categories.find((id) => id === acc.id))

                                        return (
                                            <CategoryFilter
                                                key={`account:filter:${acc.id}`}
                                                account={acc}
                                                active={active}
                                                onClick={onClick(acc, active)}
                                            />
                                        )
                                    })
                                }
                            </div>
                        </>
                    )
                }
                {
                    !isEmpty(expenses) && (
                        <>
                            <h3>Credit Lines</h3>
                            <div className="flex flex-wrap gap-2">
                                {
                                    expenses.map((acc) => {
                                        const active = !isNil(filters.categories.find((id) => id === acc.id))

                                        return (
                                            <CategoryFilter
                                                key={`account:filter:${acc.id}`}
                                                account={acc}
                                                active={active}
                                                onClick={onClick(acc, active)}
                                            />
                                        )
                                    })
                                }
                            </div>
                        </>
                    )
                }
            </AccordionContent>
        </AccordionItem>
    )
}

function CategoryFilter({ account: { name, color }, active, onClick }: AccountProps) {
    return (
        <span
            className="rounded-full border px-2 py-1 cursor-pointer flex items-center gap-2"
            style={{
                backgroundColor: active ? color : "transparent",
                color: active ? accountContrastColor(color) : color,
                borderColor: color
            }}
            onClick={onClick}
        >
            <span>{name}</span>
        </span>
    )
}