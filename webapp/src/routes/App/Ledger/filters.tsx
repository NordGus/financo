import { Dispatch, useEffect, useState } from "react"
import { FiltersAction, FiltersState } from "./_index"
import { DateRange } from "react-day-picker"
import { Calendar } from "@components/ui/calendar"
import { useQuery } from "@tanstack/react-query"
import { staleTimeDefault } from "@queries/Client"
import { getSelectableAccounts } from "@api/accounts"
import { Throbber } from "@components/Throbber"
import { isEmpty, isNil } from "lodash"
import { Kind, Select } from "@/types/Account"
import { accountContrastColor } from "@helpers/account/accountContrastColor"

interface Props {
    state: FiltersState
    dispatch: Dispatch<FiltersAction>
}

export function Filters({ state, dispatch }: Props) {
    const [range, setRange] = useState<DateRange | undefined>({ from: state.filters.from, to: state.filters.to })
    const { data: accounts, isFetching, isError, error } = useQuery({
        queryKey: ["accounts", "select"],
        queryFn: getSelectableAccounts,
        staleTime: staleTimeDefault,
    })

    useEffect(() => {
        if (state.filters.from === range?.from && state.filters.to === range?.to) return

        dispatch({ type: "UPDATE_DATES", range: range ?? { from: undefined, to: undefined } })
    }, [range])

    if (isError) throw error

    return (
        <div className="text-zinc-950 dark:text-zinc-50 py-4 flex flex-col gap-2">
            <h3 className="font-semibold">Date</h3>
            <Calendar
                mode="range"
                selected={range}
                onSelect={setRange}
                numberOfMonths={2}
            />
            {
                isFetching
                    ? <div className="flex justify-center items-center gap-2">
                        <Throbber variant="small" />
                        <span>Fetching</span>
                    </div>
                    : <AccountsFilter accounts={accounts} state={state} dispatch={dispatch} />

            }
        </div>
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
    const income = accounts.filter(({ kind }) => kind === Kind.ExternalIncome)
    const expenses = accounts.filter(({ kind }) => kind === Kind.ExternalExpense)

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
        <>
            {
                !isEmpty(capital) && (
                    <>
                        <h3 className="font-semibold">Capital Accounts</h3>
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
                        <h3 className="font-semibold">Savings Accounts</h3>
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
                        <h3 className="font-semibold">Loans</h3>
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
                        <h3 className="font-semibold">Credit Lines</h3>
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
            {
                !isEmpty(income) && (
                    <>
                        <h3 className="font-semibold">Income</h3>
                        <div className="flex flex-wrap gap-2">
                            {
                                income.map((acc) => {
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
                !isEmpty(expenses) && (
                    <>
                        <h3 className="font-semibold">Expenses</h3>
                        <div className="flex flex-wrap gap-2">
                            {
                                expenses.map((acc) => {
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
        </>
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
            className="rounded border px-2 py-1 cursor-pointer flex items-center gap-2"
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