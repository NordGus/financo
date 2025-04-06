import { format } from "date-fns";
import { MoveHorizontalIcon } from "lucide-react";
import { ComponentProps, useMemo, useReducer } from "react";
import { DateRange } from "react-day-picker";
import { useNavigation } from "react-router";
import { Button } from "~/modules/shared/components/ui/button";
import { useFilters } from "../hooks/use-filters";
import { Period } from "../types/transactions";
import { DateDayPicker } from "./dialogs/date-day-picker";
import { DateRangePicker } from "./dialogs/date-range-picker";
import { PeriodShortcuts } from "./dialogs/period-shortcuts";
import { PeriodIcon } from "./period-icon";

const FORMAT_DATE_STRING = "LLL dd, y"

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

export function DateFilter({ ...props }: ComponentProps<typeof Button>) {
  const { state: navigationState } = useNavigation()
  const [{ to, from, period }, setFilters] = useFilters()

  const [state, setState] = useReducer(reducer, { from, to, period, open: false, picker: null })

  const submitting = navigationState !== "idle"

  const onFilterChange = (from: Date | undefined, to: Date | undefined, period: Period) => {
    setFilters(prev => ({ ...prev, from, to, period }))
    setState({ type: _actions.FILTERS_CHANGED, from, to, period })
  }

  return (
    <>
      <Button
        variant={"ghost"}
        type="button"
        {...props}
        onClick={() => setState({ type: _actions.OPEN_CHANGED, open: true })}
      >
        <PeriodDisplay range={{ to, from }} period={period} />
      </Button>

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

  return (
    <>
      <PeriodIcon period={period} size={"sm"} from={range.from} /> {from} <MoveHorizontalIcon /> {to}
    </>
  )
}