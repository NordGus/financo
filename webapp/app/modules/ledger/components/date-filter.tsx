import { format } from "date-fns";
import { FunnelPlus, MoveHorizontalIcon } from "lucide-react";
import { ComponentProps, use, useMemo, useReducer } from "react";
import { DateRange } from "react-day-picker";
import { useNavigation } from "react-router";
import { cn } from "~/lib/utils";
import { Button } from "~/modules/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "~/modules/shared/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/modules/shared/components/ui/tooltip";
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
  const { filters, setFilters } = use(FiltersContext)

  const [state, setState] = useReducer(
    reducer,
    {
      from: filters.from,
      to: filters.to,
      period: filters.period,
      open: false,
      picker: null
    }
  )

  const submitting = navigationState !== "idle"

  const onFilterChange = (from: Date | undefined, to: Date | undefined, period: Period) => {
    setState({ type: _actions.FILTERS_CHANGED, from, to, period })
    setFilters(prev => ({ ...prev, from, to, period }))
  }

  return (
    <Dialog
      open={state.open}
      onOpenChange={(open) => setState({ type: _actions.OPEN_CHANGED, open })}
    >
      <div className={cn("grid grid-cols-[1fr_10fr_1fr] gap-1 lg:min-w-sm lg:max-w-sm", className)} {...props}>
        <MoveDateRangeLink direction="backwards" variant={"outline"} />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={"outline"}
              type="button"
              onClick={() => setState({ type: _actions.OPEN_CHANGED, open: true })}
              className={cn("cursor-pointer", (!state.from || !state.to) && "col-span-3")}
            >
              <PeriodDisplay range={{ to: state.to, from: state.from }} period={state.period} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {"Filter Transactions by Date"}
          </TooltipContent>
        </Tooltip>
        <MoveDateRangeLink direction="forwards" variant={"outline"} />
      </div>
      <DialogContent className="sm:max-w-[fit-content]">
        <DialogHeader>
          <DialogTitle>
            {"Filter by Date"}
          </DialogTitle>
          <DialogDescription>
            {"Select the periods you want to filter the ledger's Transactions by"}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <PeriodShortcuts
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
          />

          <DateDayPicker
            open={state.open && state.picker === "day"}
            onOpenChange={(open) => setState({ type: _actions.DAY_PICKER_OPENED, open })}
            date={state.to}
            onConfirm={(date) => onFilterChange(date, date, "daily")}
            submitting={submitting}
          />
        </div>
        <DialogFooter className={cn(state.picker === null && "hidden")}>
          <Button>
            <FunnelPlus /> Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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