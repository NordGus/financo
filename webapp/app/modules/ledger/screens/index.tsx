import { add, differenceInSeconds, endOfMonth, endOfWeek, endOfYear, getDayOfYear, isFirstDayOfMonth, isLastDayOfMonth, isSameDay, isSameWeek, isSaturday, isSunday, lastDayOfYear, startOfMonth, startOfWeek, startOfYear, sub } from "date-fns";
import { BookmarkIcon, CalendarIcon, ListFilterIcon, PlusIcon } from "lucide-react";
import { Fragment, useCallback, useReducer, useRef } from "react";
import { Button } from "~/modules/shared/components/ui/button";
import { DateGroup } from "../components/date-group";
import { DatePosting } from "../components/date-posting";
import { AccountPicker } from "../components/dialogs/account-picker";
import { CategoryPicker } from "../components/dialogs/category-picker";
import { DateDayPicker } from "../components/dialogs/date-day-picker";
import { DateRangePicker } from "../components/dialogs/date-range-picker";
import { PeriodShortcuts } from "../components/dialogs/period-shortcuts";
import { Entry } from "../components/entry";
import { NoResults } from "../components/no-results";
import { filterFrom, filterTo } from "../defaults/filters";
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

type Open = "period" | "day-picker" | "range-picker" | "accounts" | "categories" | null

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
  ACCOUNT_FILTER_ADDED: "ACCOUNT_FILTER_ADDED",
  ACCOUNT_FILTER_REMOVED: "ACCOUNT_FILTER_REMOVED",
  CATEGORY_FILTER_ADDED: "CATEGORY_FILTER_ADDED",
  CATEGORY_FILTER_REMOVED: "CATEGORY_FILTER_REMOVED",
  ACTION_SUCCEED: "ACTION_SUCCEED",
  ACTION_SUCCEED_WITHOUT_CLOSING: "ACTION_SUCCEED_WITHOUT_CLOSING",
  ACTION_FAILED: "ACTION_FAILED",
} as const

type Actions = typeof _actions

type Action =
  { type: Actions["DATE_FILTER_CHANGED"], filters: { from?: Date, to?: Date }, period: Period } |
  { type: Actions["ACCOUNT_FILTER_ADDED"], id: number } |
  { type: Actions["ACCOUNT_FILTER_REMOVED"], id: number } |
  { type: Actions["CATEGORY_FILTER_ADDED"], id: number } |
  { type: Actions["CATEGORY_FILTER_REMOVED"], id: number } |
  { type: Actions["OPEN_CHANGED"], open: Open } |
  { type: Actions["ACTION_SUCCEED"] } |
  { type: Actions["ACTION_SUCCEED_WITHOUT_CLOSING"] } |
  { type: Actions["ACTION_FAILED"] }

function reducer(state: ScreenState, action: Action): ScreenState {
  switch (action.type) {
    case "DATE_FILTER_CHANGED":
      return {
        ...state,
        from: action.filters.from,
        to: action.filters.to,
        period: action.period,
        submitting: true
      }
    case "ACCOUNT_FILTER_ADDED":
      return {
        ...state,
        accounts: [...state.accounts, action.id],
        submitting: true
      }
    case "ACCOUNT_FILTER_REMOVED":
      return {
        ...state,
        accounts: [...state.accounts.filter(id => id !== action.id)],
        submitting: true
      }
    case "CATEGORY_FILTER_ADDED":
      return {
        ...state,
        categories: [...state.categories, action.id],
        submitting: true
      }
    case "CATEGORY_FILTER_REMOVED":
      return {
        ...state,
        categories: [...state.categories.filter(id => id !== action.id)],
        submitting: true
      }
    case "OPEN_CHANGED":
      return { ...state, open: action.open }
    case "ACTION_SUCCEED":
      return {
        ...state,
        open: null,
        submitting: false
      }
    case "ACTION_SUCCEED_WITHOUT_CLOSING":
      return {
        ...state,
        submitting: false
      }
    case "ACTION_FAILED":
      return {
        ...state,
        open: null,
        submitting: false
      }
    default:
      throw new Error(`unsupported action`)
  }
}

function estimatePeriod(from: Date, to: Date): Period {
  if (getDayOfYear(from) === 1 && isSameDay(lastDayOfYear(from), to)) return "yearly"
  if (isFirstDayOfMonth(from) && isLastDayOfMonth(to)) return "monthly"
  if (isSameWeek(from, to) && isSunday(from) && isSaturday(to)) return "weekly"
  if (isSameDay(from, to)) return "daily"

  return "custom"
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
  const onActionSuccessWithoutClose = useCallback(() => {
    dispatch({ type: "ACTION_SUCCEED_WITHOUT_CLOSING" })
  }, [dispatch])
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

  const onDateFilterChange = useCallback((from: Date | undefined, to: Date | undefined, period: Period) => {
    abort.current.abort()

    abort.current = new AbortController()
    const selected = { from, to, accounts: screen.accounts, categories: screen.categories }

    dispatch({ type: "DATE_FILTER_CHANGED", filters: { from, to }, period })

    onSearchAction(selected, abort.current.signal, onActionSuccess, onActionFailed)
  }, [abort.current, dispatch, onSearchAction, onActionSuccess, onActionFailed])

  const onDateFilterMoveForward = useCallback(() => {
    if (!screen.from || !screen.to) return

    abort.current.abort()
    abort.current = new AbortController()

    const selected = {
      from: screen.from,
      to: screen.to,
      accounts: screen.accounts,
      categories: screen.categories
    }

    if (screen.period === "yearly") {
      const point = add(screen.to, { months: 1 })

      selected.from = startOfYear(point)
      selected.to = endOfYear(point)
    } else if (screen.period === "monthly") {
      const point = add(screen.to, { weeks: 1 })

      selected.from = startOfMonth(point)
      selected.to = endOfMonth(point)
    } else if (screen.period === "weekly") {
      const point = add(screen.to, { days: 1 })

      selected.from = startOfWeek(point)
      selected.to = endOfWeek(point)
    } else if (screen.period === "daily") {
      selected.from = add(screen.from, { days: 1 })
      selected.to = add(screen.to, { days: 1 })
    } else {
      const point = add(screen.to, { days: 1 })
      const diff = differenceInSeconds(screen.to, screen.from)

      selected.from = point
      selected.to = add(point, { seconds: diff })
    }

    dispatch({ type: "DATE_FILTER_CHANGED", filters: { from: selected.from, to: selected.to }, period: screen.period })

    onSearchAction(selected, abort.current.signal, onActionSuccess, onActionFailed)
  }, [
    abort.current,
    dispatch,
    screen.from,
    screen.to,
    screen.accounts,
    screen.categories,
    screen.period,
    onSearchAction,
    onActionSuccess,
    onActionFailed,
  ])

  const onDateFilterMoveBackwards = useCallback(() => {
    if (!screen.from || !screen.to) return

    abort.current.abort()
    abort.current = new AbortController()

    const selected = {
      from: screen.from,
      to: screen.to,
      accounts: screen.accounts,
      categories: screen.categories
    }

    if (screen.period === "yearly") {
      const point = sub(screen.from, { months: 1 })

      selected.from = startOfYear(point)
      selected.to = endOfYear(point)
    } else if (screen.period === "monthly") {
      const point = sub(screen.from, { weeks: 1 })

      selected.from = startOfMonth(point)
      selected.to = endOfMonth(point)
    } else if (screen.period === "weekly") {
      const point = sub(screen.from, { days: 1 })

      selected.from = startOfWeek(point)
      selected.to = endOfWeek(point)
    } else if (screen.period === "daily") {
      selected.from = sub(screen.from, { days: 1 })
      selected.to = sub(screen.to, { days: 1 })
    } else {
      const point = sub(screen.from, { days: 1 })
      const diff = differenceInSeconds(screen.to, screen.from)

      selected.from = sub(point, { seconds: diff })
      selected.to = point
    }

    dispatch({ type: "DATE_FILTER_CHANGED", filters: { from: selected.from, to: selected.to }, period: screen.period })

    onSearchAction(selected, abort.current.signal, onActionSuccess, onActionFailed)
  }, [
    abort.current,
    dispatch,
    screen.from,
    screen.to,
    screen.accounts,
    screen.categories,
    screen.period,
    onSearchAction,
    onActionSuccess,
    onActionFailed,
  ])

  const onAccountFilterAdd = useCallback((id: number) => {
    abort.current.abort()

    abort.current = new AbortController()
    const selected = {
      from: screen.from,
      to: screen.to,
      accounts: [...screen.accounts, id],
      categories: screen.categories
    }

    dispatch({ type: "ACCOUNT_FILTER_ADDED", id })

    onSearchAction(selected, abort.current.signal, onActionSuccessWithoutClose, onActionFailed)
  }, [abort.current, dispatch, onSearchAction, onActionSuccessWithoutClose, onActionFailed])

  const onAccountFilterRemove = useCallback((id: number) => {
    abort.current.abort()

    abort.current = new AbortController()
    const selected = {
      from: screen.from,
      to: screen.to,
      accounts: screen.accounts.filter(el => el !== id),
      categories: screen.categories
    }

    dispatch({ type: "ACCOUNT_FILTER_REMOVED", id })

    onSearchAction(selected, abort.current.signal, onActionSuccessWithoutClose, onActionFailed)
  }, [abort.current, dispatch, onSearchAction, onActionSuccessWithoutClose, onActionFailed])

  const onCategoryFilterAdd = useCallback((id: number) => {
    abort.current.abort()

    abort.current = new AbortController()
    const selected = {
      from: screen.from,
      to: screen.to,
      accounts: screen.accounts,
      categories: [...screen.categories, id]
    }

    dispatch({ type: "CATEGORY_FILTER_ADDED", id })

    onSearchAction(selected, abort.current.signal, onActionSuccessWithoutClose, onActionFailed)
  }, [abort.current, dispatch, onSearchAction, onActionSuccessWithoutClose, onActionFailed])

  const onCategoryFilterRemove = useCallback((id: number) => {
    abort.current.abort()

    abort.current = new AbortController()
    const selected = {
      from: screen.from,
      to: screen.to,
      accounts: screen.accounts,
      categories: screen.categories.filter(el => el !== id)
    }

    dispatch({ type: "CATEGORY_FILTER_REMOVED", id })

    onSearchAction(selected, abort.current.signal, onActionSuccessWithoutClose, onActionFailed)
  }, [abort.current, dispatch, onSearchAction, onActionSuccessWithoutClose, onActionFailed])


  return (
    <Fragment>
      <div className="relative overflow-hidden h-full">
        <DatePosting
          range={{ from: screen.from, to: screen.to }}
          onForwards={onDateFilterMoveForward}
          onBackwards={onDateFilterMoveBackwards}
        />
        <div className="absolute bottom-0 right-0 p-4 inline-flex gap-4 flex-wrap justify-end">
          <Button
            size={"icon"}
            variant={"secondary"}
            className="shadow-lg"
            onClick={() => onOpenPeriodFilterChange(true)}
          >
            <CalendarIcon />
          </Button>
          <Button
            size={"icon"}
            variant={"secondary"}
            className="shadow-lg"
            onClick={() => onOpenAccountsFilterChange(true)}
          >
            <ListFilterIcon />
          </Button>
          <Button
            size={"icon"}
            variant={"secondary"}
            className="shadow-lg"
            onClick={() => onOpenCategoriesFilterChange(true)}
          >
            <BookmarkIcon />
          </Button>
          <Button
            size={"icon"}
            className="shadow-lg"
            onClick={() => { }}
          >
            <PlusIcon />
          </Button>
        </div>
        <div className="overflow-x-hidden overflow-y-auto h-full p-4">
          {
            transactions.length === 0
              ? <NoResults />
              : (
                <>
                  <span className="content-[''] h-9 block my-2" />
                  <div className="flex flex-col gap-2">
                    {
                      transactions.map(([date, entries]) => (
                        <DateGroup key={date} date={date}>
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
        onAdd={onAccountFilterAdd}
        onRemove={onAccountFilterRemove}
        submitting={screen.submitting}
      />

      <CategoryPicker
        open={screen.open === "categories"}
        onOpenChange={onOpenCategoriesFilterChange}
        accounts={Array.from(accounts.values())}
        selected={screen.categories}
        onAdd={onCategoryFilterAdd}
        onRemove={onCategoryFilterRemove}
        submitting={screen.submitting}
      />
    </Fragment >
  )
}