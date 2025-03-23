import { ListFilterIcon, PlusIcon } from "lucide-react";
import { useCallback, useReducer, useRef } from "react";
import { Button } from "~/modules/shared/components/ui/button";
import { SearchAbortedError } from "~/modules/shared/types/errors";
import { AccountsFilter } from "../components/accounts-filter";
import { DateFilter } from "../components/date-filter";
import { DateGroup } from "../components/date-group";
import { AccountPicker } from "../components/dialogs/account-picker";
import { CategoryPicker } from "../components/dialogs/category-picker";
import { DateDayPicker } from "../components/dialogs/date-day-picker";
import { DateRangePicker } from "../components/dialogs/date-range-picker";
import { PeriodShortcuts } from "../components/dialogs/period-shortcuts";
import { TransactionSourcePicker } from "../components/dialogs/transaction-source-picker";
import { TransactionTargetPicker } from "../components/dialogs/transaction-target-picker";
import { Entry } from "../components/entry";
import { CreateTransaction } from "../components/forms/create";
import { NoResults } from "../components/no-results";
import { filterFrom, filterTo } from "../defaults/filters";
import { calculateDateRangeMovement, Movement } from "../helpers/calculate-date-range-movement";
import { estimatePeriod } from "../helpers/estimate-period";
import { Account } from "../types/accounts";
import { Filters, Period, SearchAction, Transactions } from "../types/transactions";

interface Props {
  transactions: Transactions
  accounts: Map<number, Account>
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
    from: filters.from ?? filterFrom(),
    to: filters.to ?? filterTo(),
    accounts: filters.accounts ?? [],
    categories: filters.categories ?? [],
    open: null,
    period: estimatePeriod(filters.from ?? filterFrom(), filters.to ?? filterTo()),
    submitting: false,
  }
}

export function Screen({
  transactions,
  accounts,

  filters,

  onSearchAction,
}: Props) {
  const [screen, dispatch] = useReducer(reducer, { filters }, init)

  const abort = useRef(new AbortController())

  const onActionSuccess = useCallback(() => dispatch({ type: "ACTION_SUCCEED" }), [dispatch])
  const onActionFailed = useCallback(() => dispatch({ type: "ACTION_FAILED" }), [dispatch])

  const onOpenPeriodFilterChange = (open: boolean) =>
    dispatch({ type: "OPEN_CHANGED", open: open ? "period" : null })
  const onOpenRangePickerChange = (open: boolean) =>
    dispatch({ type: "OPEN_CHANGED", open: open ? "range-picker" : null })
  const onOpenDayPickerChange = (open: boolean) =>
    dispatch({ type: "OPEN_CHANGED", open: open ? "day-picker" : null })
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

  const onDateFilterChange = useCallback((from: Date | undefined, to: Date | undefined, period: Period) => {
    if (!abort.current.signal.aborted) abort.current.abort(new SearchAbortedError())
    abort.current = new AbortController()

    dispatch({ type: "DATE_FILTER_CHANGED", filters: { from, to }, period })
    onSearch(
      {
        from,
        to,
        accounts: [...screen.accounts],
        categories: [...screen.categories]
      },
      abort.current.signal
    )
  }, [dispatch, onSearch, abort.current, screen.accounts, screen.categories])

  const onDateFilterMoveForward = useCallback(() => {
    if (!screen.from || !screen.to) return

    if (!abort.current.signal.aborted) abort.current.abort(new SearchAbortedError())
    abort.current = new AbortController()

    const { from, to } = calculateDateRangeMovement(Movement.Forwards, screen.from, screen.to, screen.period)

    dispatch({ type: "DATE_FILTER_CHANGED", filters: { from, to }, period: screen.period })
    onSearch(
      {
        from,
        to,
        accounts: [...screen.accounts],
        categories: [...screen.categories]
      },
      abort.current.signal
    )
  }, [dispatch, onSearch, abort.current, screen.from, screen.to, screen.accounts, screen.categories])

  const onDateFilterMoveBackwards = useCallback(() => {
    if (!screen.from || !screen.to) return

    if (!abort.current.signal.aborted) abort.current.abort(new SearchAbortedError())
    abort.current = new AbortController()

    const { from, to } = calculateDateRangeMovement(Movement.Backwards, screen.to, screen.from, screen.period)

    dispatch({ type: "DATE_FILTER_CHANGED", filters: { from, to }, period: screen.period })
    onSearch(
      {
        from,
        to,
        accounts: [...screen.accounts],
        categories: [...screen.categories]
      },
      abort.current.signal
    )
  }, [dispatch, onSearch, abort.current, screen.from, screen.to, screen.accounts, screen.categories])

  const onAccountFilterChange = useCallback((ids: number[]) => {
    if (!abort.current.signal.aborted) abort.current.abort(new SearchAbortedError())
    abort.current = new AbortController()

    dispatch({ type: "ACCOUNTS_FILTER_CHANGED", ids })
    onSearch(
      {
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
    <>
      <div className="relative overflow-hidden h-full flex flex-col">
        <div className="absolute bottom-0 right-0 p-4 inline-flex gap-4 flex-wrap justify-end">
          <Button
            size={"icon"}
            className="shadow-lg"
            onClick={() => onOpenTransactionTargetPickerChange(true)}
          >
            <PlusIcon />
          </Button>
        </div>
        <div className="flex items-start gap-2 p-2">
          <span className="h-9 w-9" />
          <AccountsFilter
            className="grow"
            accounts={accounts}
            selected={screen.accounts}
            onClick={() => onOpenAccountsFilterChange(true)}
          />
          <Button
            size={"icon"}
            variant={"link"}
            onClick={() => onOpenCategoriesFilterChange(true)}
          >
            <ListFilterIcon />
          </Button>
        </div>
        <DateFilter
          range={{ from: screen.from, to: screen.to }}
          period={screen.period}
          onClick={() => onOpenPeriodFilterChange(true)}
          onForwards={onDateFilterMoveForward}
          onBackwards={onDateFilterMoveBackwards}
        />
        <div className="overflow-x-hidden overflow-y-auto h-full">
          {
            transactions.length === 0
              ? <NoResults />
              : (
                <>
                  <div className="flex flex-col">
                    {
                      transactions.map(([date, entries], idx) => (
                        <DateGroup key={date} date={date} isFirst={idx === 0}>
                          {entries.map((transaction) => {
                            const source = accounts.get(transaction.sourceId)!
                            const sourceParent = source.parentId === null ? null : accounts.get(source.parentId)!
                            const target = accounts.get(transaction.targetId)!
                            const targetParent = target.parentId === null ? null : accounts.get(target.parentId)!

                            return (
                              <Entry
                                key={`${date}.${transaction.id}`}
                                transaction={transaction}
                                source={source}
                                sourceParent={sourceParent}
                                target={target}
                                targetParent={targetParent}
                              />
                            )
                          })}
                        </DateGroup>
                      ))
                    }
                  </div>
                  <span className="content-[''] h-9 block my-2" />
                </>
              )
          }
        </div>
      </div>

      <PeriodShortcuts
        open={screen.open === "period"}
        onOpenChange={onOpenPeriodFilterChange}
        onOpenRangePicker={onOpenRangePickerChange}
        onOpenDayPicker={onOpenDayPickerChange}
        onFilterChange={onDateFilterChange}
        submitting={screen.submitting}
      />

      <DateRangePicker
        open={screen.open === "range-picker"}
        onOpenChange={onOpenRangePickerChange}
        range={{ from: screen.from, to: screen.to }}
        onConfirm={(range) => onDateFilterChange(range?.from, range?.to, "custom")}
        submitting={screen.submitting}
      />

      <DateDayPicker
        open={screen.open === "day-picker"}
        onOpenChange={onOpenDayPickerChange}
        date={screen.to}
        onConfirm={(date) => onDateFilterChange(date, date, "daily")}
        submitting={screen.submitting}
      />

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
    </>
  )
}