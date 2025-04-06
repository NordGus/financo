import { useCallback, useReducer, useRef } from "react";
import { Link, useNavigation } from "react-router";
import { FullScreenThrobber } from "~/modules/shared/components/throbber";
import { Button } from "~/modules/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/modules/shared/components/ui/card";
import { SearchAbortedError } from "~/modules/shared/types/errors";
import { DateFilter } from "../components/date-filter";
import { AccountPicker } from "../components/dialogs/account-picker";
import { CategoryPicker } from "../components/dialogs/category-picker";
import { TransactionSourcePicker } from "../components/dialogs/transaction-source-picker";
import { TransactionTargetPicker } from "../components/dialogs/transaction-target-picker";
import { CreateTransaction } from "../components/forms/create";
import { TransactionsSearchResults } from "../components/transactions-search-results";
import { Accounts } from "../types/accounts";
import { Filters, Period } from "../types/filters";
import { SearchAction } from "../types/transactions";

interface Props {
  accounts: Accounts
  filters: Filters
  onSearchAction: SearchAction
}

type InitialState = {
  filters: Filters
}

type Open = "period" |
  "day-picker" |
  "range-picker" |
  "accounts" |
  "categories" |
  "creation-target-picker" |
  "creation-source-picker" |
  "create" |
  null

type ScreenState = {
  from?: Date
  to?: Date
  accounts: number[]
  categories: number[]
  open: Open
  period: Period
  submitting: boolean
}

const _actions = {
  DATE_FILTER_CHANGED: "DATE_FILTER_CHANGED",
  OPEN_CHANGED: "OPEN_CHANGED",
  ACCOUNTS_FILTER_CHANGED: "ACCOUNTS_FILTER_CHANGED",
  CATEGORIES_FILTER_CHANGED: "CATEGORIES_FILTER_CHANGED",
  ACTION_SUCCEED: "ACTION_SUCCEED",
  ACTION_FAILED: "ACTION_FAILED",
} as const

type Actions = typeof _actions

type Action =
  { type: Actions["DATE_FILTER_CHANGED"], filters: { from?: Date, to?: Date }, period: Period } |
  { type: Actions["ACCOUNTS_FILTER_CHANGED"], ids: number[] } |
  { type: Actions["CATEGORIES_FILTER_CHANGED"], ids: number[] } |
  { type: Actions["OPEN_CHANGED"], open: Open } |
  { type: Actions["ACTION_SUCCEED"] } |
  { type: Actions["ACTION_FAILED"] }

function reducer(state: ScreenState, action: Action): ScreenState {
  switch (action.type) {
    case "DATE_FILTER_CHANGED":
      return {
        ...state,
        from: action.filters.from,
        to: action.filters.to,
        period: action.period,
        open: null,
        submitting: true
      }
    case "ACCOUNTS_FILTER_CHANGED":
      return {
        ...state,
        accounts: [...action.ids],
        submitting: true
      }
    case "CATEGORIES_FILTER_CHANGED":
      return {
        ...state,
        categories: [...action.ids],
        submitting: true
      }
    case "OPEN_CHANGED":
      return { ...state, open: action.open }
    case "ACTION_SUCCEED":
      return {
        ...state,
        submitting: false
      }
    case "ACTION_FAILED":
      return {
        ...state,
        submitting: false
      }
    default:
      throw new Error(`unsupported action`)
  }
}

function init({ filters }: InitialState): ScreenState {
  return {
    ...filters,
    from: filters.from,
    to: filters.to,
    accounts: filters.accounts ?? [],
    categories: filters.categories ?? [],
    open: null,
    period: filters.period,
    submitting: false,
  }
}

export function Screen({
  accounts,

  filters,

  onSearchAction,
}: Props) {
  const [screen, dispatch] = useReducer(reducer, { filters }, init)
  const { state: navigationState } = useNavigation()

  const abort = useRef(new AbortController())

  const onActionSuccess = useCallback(() => dispatch({ type: "ACTION_SUCCEED" }), [dispatch])
  const onActionFailed = useCallback(() => dispatch({ type: "ACTION_FAILED" }), [dispatch])

  const onOpenAccountsFilterChange = (open: boolean) =>
    dispatch({ type: "OPEN_CHANGED", open: open ? "accounts" : null })
  const onOpenCategoriesFilterChange = (open: boolean) =>
    dispatch({ type: "OPEN_CHANGED", open: open ? "categories" : null })
  const onOpenTransactionTargetPickerChange = (open: boolean) =>
    dispatch({ type: "OPEN_CHANGED", open: open ? "creation-target-picker" : null })
  const onOpenTransactionSourcePickerChange = (open: boolean) =>
    dispatch({ type: "OPEN_CHANGED", open: open ? "creation-source-picker" : null })
  const onOpenTransactionCreateChange = (open: boolean) =>
    dispatch({ type: "OPEN_CHANGED", open: open ? "create" : null })

  const onSearch = useCallback(async (nextFilters: Filters, signal: AbortSignal) => {
    await onSearchAction({ ...nextFilters }, signal, onActionSuccess, onActionFailed)
  }, [onSearchAction, onActionSuccess, onActionFailed])

  const onAccountFilterChange = useCallback((ids: number[]) => {
    if (!abort.current.signal.aborted) abort.current.abort(new SearchAbortedError())
    abort.current = new AbortController()

    dispatch({ type: "ACCOUNTS_FILTER_CHANGED", ids })
    onSearch(
      {
        period: screen.period,
        from: screen.from,
        to: screen.to,
        accounts: [...ids],
        categories: screen.categories
      },
      abort.current.signal
    )
  }, [dispatch, onSearch, abort.current, screen.from, screen.to, screen.categories])

  const onCategoryFilterChange = useCallback((ids: number[]) => {
    if (!abort.current.signal.aborted) abort.current.abort(new SearchAbortedError())
    abort.current = new AbortController()

    dispatch({ type: "CATEGORIES_FILTER_CHANGED", ids })
    onSearch(
      {
        period: screen.period,
        from: screen.from,
        to: screen.to,
        accounts: screen.accounts,
        categories: [...ids]
      },
      abort.current.signal
    )
  }, [dispatch, onSearch, abort.current, screen.from, screen.to, screen.accounts])

  const onTransactionTargetSelect = useCallback(() => {
    dispatch({ type: "OPEN_CHANGED", open: "creation-source-picker" })
  }, [dispatch])

  const onTransactionSourceSelect = useCallback(() => {
    dispatch({ type: "OPEN_CHANGED", open: "create" })
  }, [dispatch])

  return (
    <div className="grid grid-cols-[1fr_1.5fr] gap-4 px-2 h-full">
      <div className="pt-2 h-full overflow-y-auto no-scrollbar">
        <Card className="overflow-clip sticky top-0 z-40">
          <CardHeader>
            <CardTitle>
              Ledger
            </CardTitle>
            <CardDescription>
              View and manage your financial transactions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <DateFilter />
            <div className="flex gap-2">
              <Button className="flex-1">Accounts</Button>
              <Button className="flex-1">Category</Button>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button asChild>
              <Link to={"./"}>
                Reset Filters
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <div className="mt-2">
          <TransactionsSearchResults />
          <TransactionsSearchResults />
          <TransactionsSearchResults />
        </div>
      </div>
      <div className="h-full overflow-y-auto no-scrollbar">
        {
          navigationState !== "idle" && (
            <FullScreenThrobber className="absolute inset-0 z-50" />
          )
        }
        <TransactionsSearchResults />
      </div>

      <AccountPicker
        open={screen.open === "accounts"}
        onOpenChange={onOpenAccountsFilterChange}
        accounts={Array.from(accounts.values())}
        selected={screen.accounts}
        onChangePick={onAccountFilterChange}
        submitting={screen.submitting}
      />

      <CategoryPicker
        open={screen.open === "categories"}
        onOpenChange={onOpenCategoriesFilterChange}
        accounts={Array.from(accounts.values())}
        selected={screen.categories}
        onChangePick={onCategoryFilterChange}
        submitting={screen.submitting}
      />

      <TransactionTargetPicker
        open={screen.open === "creation-target-picker"}
        onOpenChange={onOpenTransactionTargetPickerChange}
        onSelected={onTransactionTargetSelect}
      />

      <TransactionSourcePicker
        open={screen.open === "creation-source-picker"}
        onOpenChange={onOpenTransactionSourcePickerChange}
        onSelected={onTransactionSourceSelect}
      />

      <CreateTransaction
        open={screen.open === "create"}
        onOpenChange={onOpenTransactionCreateChange}
        onSubmitAction={async (__values) => { }}
        submitting={screen.submitting}
      />
    </div>
  )
}