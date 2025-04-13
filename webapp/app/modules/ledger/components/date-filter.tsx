import { format } from "date-fns";
import { MoveHorizontalIcon } from "lucide-react";
import { ComponentProps, use, useMemo, useReducer } from "react";
import { DateRange } from "react-day-picker";
import { useNavigation } from "react-router";
import { cn } from "~/lib/utils";
import { Button } from "~/modules/shared/components/ui/button";
import { FiltersContext } from "../contexts/filters-contenxt";
import { Period } from "../types/transactions";
import { MoveDateRangeLink } from "./buttons/move-date-rage-link";
import { DateDayPicker } from "./dialogs/date-day-picker";
import { DateRangePicker } from "./dialogs/date-range-picker";
import { PeriodShortcuts } from "./dialogs/period-shortcuts";
import { PeriodIcon } from "./period-icon";

const FORMAT_DATE_STRING = "P"

type DateFilterState = {
  open: boolean
  from?: Date
  to?: Date
  period: Period
  picker: null | "day" | "range"
}

const _actions = {
  OPEN_CHANGED: "OPEN_CHANGED",
  RANGE_PICKER_OPENED: "RANGE_PICKER_OPENED",
  DAY_PICKER_OPENED: "DAY_PICKER_OPENED",
  FILTERS_CHANGED: "FILTERS_CHANGED"
} as const;

type Actions = typeof _actions

type Action =
  { type: Actions["OPEN_CHANGED"], open: boolean } |
  { type: Actions["RANGE_PICKER_OPENED"], open: boolean } |
  { type: Actions["DAY_PICKER_OPENED"], open: boolean } |
  { type: Actions["FILTERS_CHANGED"], from?: Date, to?: Date, period: Period }

function reducer(state: DateFilterState, action: Action): DateFilterState {
  switch (action.type) {
    case _actions.OPEN_CHANGED:
      return {
        ...state,
        open: action.open
      }
    case _actions.DAY_PICKER_OPENED:
      return {
        ...state,
        picker: action.open ? "day" : null
      }
    case _actions.RANGE_PICKER_OPENED:
      return {
        ...state,
        picker: action.open ? "range" : null
      }
    case _actions.FILTERS_CHANGED:
      return {
        ...state,
        from: action.from,
        to: action.to,
        period: action.period,
        open: false,
        picker: null,
      }
  }
}

export function DateFilter({ className, ...props }: ComponentProps<"div">) {
  const { state: navigationState } = useNavigation()
  const { filters: { to, from, period }, setFilters } = use(FiltersContext)

  const [state, setState] = useReducer(reducer, { from, to, period, open: false, picker: null })

  const submitting = navigationState !== "idle"

  const onFilterChange = (from: Date | undefined, to: Date | undefined, period: Period) => {
    setFilters(prev => ({ ...prev, from, to, period }))
    setState({ type: _actions.FILTERS_CHANGED, from, to, period })
  }

  return (
    <>
      <div className={cn("grid grid-cols-[1fr_10fr_1fr] gap-1 lg:min-w-sm lg:max-w-sm", className)} {...props}>
        <MoveDateRangeLink direction="backwards" variant={"outline"} />
        <Button
          variant={"outline"}
          type="button"
          onClick={() => setState({ type: _actions.OPEN_CHANGED, open: true })}
          className={cn("cursor-pointer", (!from || !to) && "col-span-3")}
        >
          <PeriodDisplay range={{ to, from }} period={period} />
        </Button>
        <MoveDateRangeLink direction="forwards" variant={"outline"} />
      </div>

      <PeriodShortcuts
        open={state.open}
        onOpenChange={(open) => setState({ type: _actions.OPEN_CHANGED, open })}
        onOpenRangePicker={(open) => setState({ type: _actions.RANGE_PICKER_OPENED, open })}
        onOpenDayPicker={(open) => setState({ type: _actions.DAY_PICKER_OPENED, open })}
        onFilterChange={onFilterChange}
        submitting={submitting}
      />

      <DateRangePicker
        open={state.open && state.picker === "range"}
        onOpenChange={(open) => setState({ type: _actions.RANGE_PICKER_OPENED, open })}
        range={{ from: state.from, to: state.to }}
        onConfirm={(range) => onFilterChange(range?.from, range?.to, "custom")}
        submitting={submitting}
        nested={true}
      />

      <DateDayPicker
        open={state.open && state.picker === "day"}
        onOpenChange={(open) => setState({ type: _actions.DAY_PICKER_OPENED, open })}
        date={state.to}
        onConfirm={(date) => onFilterChange(date, date, "daily")}
        submitting={submitting}
      />
    </>
  )
}

interface PeriodDisplayProps {
  range: DateRange
  period: Period
}

function PeriodDisplay({ range, period }: PeriodDisplayProps) {
  if (period === "unlimited")
    return (
      <>
        <PeriodIcon period={period} size={"sm"} /> {"Entire Ledger"}
      </>
    )

  const from = useMemo(() => format(range.from!, FORMAT_DATE_STRING), [range.from])
  const to = useMemo(() => format(range.to!, FORMAT_DATE_STRING), [range.to])

  if (period === "daily")
    return (
      <>
        <PeriodIcon period={period} size={"sm"} from={range.from} /> {from}
      </>
    )

  return (
    <>
      <PeriodIcon period={period} size={"sm"} from={range.from} /> {from} <MoveHorizontalIcon /> {to}
    </>
  )
}