import { format } from "date-fns";
import { CalendarIcon, ListFilterIcon, MoveHorizontalIcon, PlusIcon } from "lucide-react";
import { Fragment, useCallback, useReducer, useRef } from "react";
import { Button } from "~/modules/shared/components/ui/button";
import { DateGroup } from "../components/date-group";
import { DateFilter } from "../components/dialogs/date-filter";
import { Entry } from "../components/entry";
import { NoResults } from "../components/no-results";
import { filterFrom, filterTo } from "../defaults/filters";
import { Account } from "../types/accounts";
import { Filters, SearchAction, Transactions } from "../types/transactions";

interface Props {
  transactions: Transactions
  accounts: Map<number, Account>
  filters: Filters
  onSearchAction: SearchAction
}

type InitialState = {
  filters: Filters
}

type Open = "calendar" | null

type ScreenState = {
  from?: Date
  to?: Date
  accounts?: number[]
  categories?: number[]
  open: Open
  submitting: boolean
}

const _actions = {
  DATE_FILTER_CHANGED: "DATE_FILTER_CHANGED",
  OPEN_CHANGED: "OPEN_CHANGED",
  ACTION_SUCCEED: "ACTION_SUCCEED",
  ACTION_FAILED: "ACTION_FAILED",
} as const

type Actions = typeof _actions

type Action =
  { type: Actions["DATE_FILTER_CHANGED"], filters: { from?: Date, to?: Date } } |
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

function init({ filters }: InitialState): ScreenState {
  return {
    ...filters,
    from: filters.to ?? filterFrom(),
    to: filters.from ?? filterTo(),
    open: null,
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

  const onOpenDateFilterChange = (open: boolean) =>
    dispatch({ type: "OPEN_CHANGED", open: open ? "calendar" : null })

  const onDateFilterChange = useCallback((from: Date | undefined, to: Date | undefined) => {
    abort.current.abort()

    abort.current = new AbortController()
    const selected = { from, to, accounts: screen.accounts, categories: screen.categories }

    dispatch({ type: "DATE_FILTER_CHANGED", filters: { from, to } })

    onSearchAction(selected, abort.current.signal, onActionSuccess, onActionFailed)
  }, [abort.current, dispatch, onSearchAction, onActionSuccess, onActionFailed])

  return (
    <Fragment>
      <div className="relative overflow-hidden h-full">
        <div className="absolute top-0 left-0 right-0 p-4 flex gap-4 justify-stretch w-full">
          <Button
            variant={"secondary"}
            className="shadow-lg w-full"
          >
            {
              screen.from
                ? screen.to ? (
                  <>
                    {format(screen.from, "LLL dd, y")} <MoveHorizontalIcon /> {format(screen.to, "LLL dd, y")}
                  </>
                )
                  : format(screen.from, "LLL dd, y")
                : "Entire History"
            }
          </Button>
        </div>
        <div className="absolute bottom-0 right-0 p-4 inline-flex gap-4 flex-wrap justify-end">
          <Button
            size={"icon"}
            variant={"secondary"}
            className="shadow-lg"
            onClick={() => onOpenDateFilterChange(true)}
          >
            <CalendarIcon />
          </Button>
          <Button
            size={"icon"}
            variant={"secondary"}
            className="shadow-lg"
            onClick={() => { }}
          >
            <ListFilterIcon />
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

      <DateFilter
        open={screen.open === "calendar"}
        onOpenChange={onOpenDateFilterChange}
        range={{ from: screen.from, to: screen.to }}
        onConfirm={(range) => onDateFilterChange(range?.from, range?.to)}
        submitting={screen.submitting}
      />
    </Fragment >
  )
}