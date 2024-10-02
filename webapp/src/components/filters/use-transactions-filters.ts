import moment from "moment"
import * as React from "react"
import { DateRange } from "react-day-picker"

const actionTypes = {
    UPDATE_DATES: "UPDATE_DATES",
    ADD_ACCOUNTS: "ADD_ACCOUNTS",
    REMOVE_ACCOUNTS: "REMOVE_ACCOUNTS",
    ADD_CATEGORIES: "ADD_CATEGORIES",
    REMOVE_CATEGORIES: "REMOVE_CATEGORIES",
    CLEAR: "CLEAR"
} as const

type FiltersActionType = typeof actionTypes

type Filters = { from: Date | undefined, to: Date | undefined, accounts: number[], categories: number[] }

type FiltersState = { clearable: boolean, filters: Filters }

type FiltersAction =
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

const initialFilters: FiltersState = {
    filters: {
        from: moment().startOf('month').toDate(),
        to: moment().toDate(),
        accounts: [],
        categories: []
    },
    clearable: false
}

function reducer(state: FiltersState, action: FiltersAction): FiltersState {
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
            return { ...initialFilters }
    }
}

const TransactionsFilterContext = React.createContext<FiltersState>({ ...initialFilters })
const TransactionsFilterDispatchContext = React.createContext<React.Dispatch<FiltersAction>>((_value) => { })

function useTransactionsFilter() {
    const [filters, dispatch] = React.useReducer(reducer, { ...initialFilters })

    return {
        filters,
        dispatch
    }
}

function useTransactionsFiltersCtx() {
    return React.useContext(TransactionsFilterContext)
}

function useTransactionsFiltersDispatch() {
    return React.useContext(TransactionsFilterDispatchContext)
}

export {
    initialFilters,
    reducer,
    TransactionsFilterContext,
    TransactionsFilterDispatchContext,
    useTransactionsFilter,
    useTransactionsFiltersCtx,
    useTransactionsFiltersDispatch
}

export type { Filters, FiltersAction, FiltersActionType, FiltersState }
