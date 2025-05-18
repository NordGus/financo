import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns";
import { Funnel, FunnelPlus, FunnelX } from "lucide-react";
import { ComponentProps, use, useEffect, useReducer } from "react";
import { cn } from "~/lib/utils";
import { Button } from "~/modules/shared/components/ui/button";
import { Calendar } from "~/modules/shared/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/modules/shared/components/ui/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider
} from "~/modules/shared/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/modules/shared/components/ui/tooltip";
import { FiltersContext } from "../../../contexts/filters-context";
import { defaultValues as defaultFilters } from "../../../types/filters";
import { Period } from "../../../types/transactions";

const NUMBER_OF_MONTHS_IN_CALENDAR = 3

type DateFilterState = {
  open: boolean
  from?: Date
  to?: Date
  period: Period
  touched: boolean
}

const _actions = {
  OPEN_CHANGED: "OPEN_CHANGED",
  PERIOD_CHANGED: "PERIOD_CHANGED",
  DATES_CHANGED: "DATES_CHANGED",
  FILTERS_CHANGED: "FILTERS_CHANGED",
} as const;

type Actions = typeof _actions

type Action =
  { type: Actions["OPEN_CHANGED"], open: boolean, touched: boolean, from?: Date, to?: Date, period: Period } |
  { type: Actions["PERIOD_CHANGED"], period: Period } |
  { type: Actions["DATES_CHANGED"], from?: Date, to?: Date } |
  { type: Actions["FILTERS_CHANGED"], from?: Date, to?: Date, period: Period, touched: boolean }

function reducer(state: DateFilterState, action: Action): DateFilterState {
  switch (action.type) {
    case _actions.OPEN_CHANGED:
      return {
        from: action.from,
        to: action.to,
        period: action.period,
        open: action.open,
        touched: action.touched
      }
    case _actions.PERIOD_CHANGED:
      return {
        ...state,
        period: action.period
      }
    case _actions.DATES_CHANGED:
      return {
        ...state,
        from: action.from,
        to: action.to
      }
    case _actions.FILTERS_CHANGED:
      return {
        open: false,
        from: action.from,
        to: action.to,
        period: action.period,
        touched: action.touched
      }
  }
}

export function TransactionsFilters({ className }: ComponentProps<typeof Button>) {
  const { filters, setFilters } = use(FiltersContext)

  const [state, setState] = useReducer(
    reducer,
    {
      from: filters.from,
      to: filters.to,
      period: filters.period,
      open: false,
      touched: false
    }
  )

  // const submitting = navigationState !== "idle"

  // const onFilterChange = (from: Date | undefined, to: Date | undefined, period: Period) =>
  //   setState({ type: _actions.FILTERS_CHANGED, from, to, period })

  // const onFilterChangeByShortcut = (from: Date | undefined, to: Date | undefined, period: Period) => {
  //   setState({ type: _actions.FILTERS_CHANGED_BY_SHORTCUT, from, to, period })

  //   if (debounceTimer.current !== null) clearTimeout(debounceTimer.current)

  //   debounceTimer.current = setTimeout(() => setFilters(prev => ({ ...prev, from, to, period })), DEBOUNCE_TIMER)
  // }

  const onPeriodChange = (period: Period) => setState({ type: _actions.PERIOD_CHANGED, period })
  const onDatesChange = (from?: Date, to?: Date) => setState({ type: _actions.DATES_CHANGED, from, to })

  // I'm using an effect because is the only way I have to ensure that dialog's close animation is not interrupted,
  // by the internal navigation triggered by the filters changing.
  useEffect(() => {
    if (!state.touched) return () => { } // prevents a new redirect when resetting the dialog's state

    const timer = setTimeout(
      () => setFilters(prev => ({ ...prev, from: state.from, to: state.to, period: state.period })),
      160 // the animation seems to last 150 ms
    )

    return () => {
      clearTimeout(timer)
    }
  }, [state.touched])

  useEffect(() => {
    setState({
      type: _actions.OPEN_CHANGED,
      open: state.open,
      from: filters.from,
      to: filters.to,
      period: filters.period,
      touched: state.touched
    })
  }, [
    filters.from?.toDateString(),
    filters.to?.toDateString(),
    filters.period
  ])

  return (
    <Dialog
      open={state.open}
      onOpenChange={(open) => {
        setState({
          type: _actions.OPEN_CHANGED,
          open,
          from: filters.from,
          to: filters.to,
          period: filters.period,
          touched: false
        })
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant={"outline"}
              type="button"
              size={"icon"}
              className={cn("cursor-pointer", className)}
            >
              <Funnel />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          {"Filter Transactions"}
        </TooltipContent>
      </Tooltip>

      <DialogContent
        className="overflow-hidden p-0 md:max-h-[500px] md:max-w-fit lg:max-w-fit"
      >
        <SidebarProvider className="items-stretch">
          <Sidebar collapsible="none">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>
                  {"Date"}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem key={"date.filter.custom"}>
                      <SidebarMenuButton
                        onClick={() => onPeriodChange("custom")}
                        isActive={state.period === "custom"}
                      >
                        {"By Date Range"}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem key={"date.filter.day"}>
                      <SidebarMenuButton
                        onClick={() => onPeriodChange("daily")}
                        isActive={state.period === "daily"}
                      >
                        {"By Day"}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem key={"date.filter.week"}>
                      <SidebarMenuButton
                        onClick={() => onPeriodChange("weekly")}
                        isActive={state.period === "weekly"}
                      >
                        {"By Week"}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem key={"date.filter.month"}>
                      <SidebarMenuButton
                        onClick={() => onPeriodChange("monthly")}
                        isActive={state.period === "monthly"}
                      >
                        {"By Month"}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem key={"date.filter.year"}>
                      <SidebarMenuButton
                        onClick={() => onPeriodChange("yearly")}
                        isActive={state.period === "yearly"}
                      >
                        {"By Year"}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              {/* <SidebarGroup>
                <SidebarGroupLabel>
                  Accounts
                </SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem key={"accounts.filter.active"}>
                    <SidebarMenuButton>
                      Active
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem key={"accounts.filter.archived"}>
                    <SidebarMenuButton>
                      Archived
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel>
                  Categories
                </SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem key={"accounts.filter.active"}>
                    <SidebarMenuButton>
                      Active
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem key={"accounts.filter.archived"}>
                    <SidebarMenuButton>
                      Archived
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup> */}
            </SidebarContent>
          </Sidebar>
          <div className="flex-1 overflow-hidden flex flex-col p-4 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px] gap-2">
            <DialogHeader>
              <DialogTitle>
                {"Filter Transactions"}
              </DialogTitle>
              <DialogDescription>
                {"Select the periods you want to filter the ledger's Transactions by"}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 flex items-center justify-center">
              {
                state.period === "custom" && (
                  <Calendar
                    mode="range"
                    numberOfMonths={NUMBER_OF_MONTHS_IN_CALENDAR}
                    defaultMonth={state.from}
                    selected={{ from: state.from, to: state.to }}
                    onSelect={(range) => onDatesChange(range?.from ?? state.from, range?.to ?? state.to)}
                  />
                )
              }
              {
                state.period === "daily" && (
                  <Calendar
                    mode="single"
                    numberOfMonths={NUMBER_OF_MONTHS_IN_CALENDAR}
                    defaultMonth={state.to}
                    selected={state.to}
                    onSelect={(day) => onDatesChange(day ?? state.from, day ?? state.to)}
                  />
                )
              }
              {
                state.period === "weekly" && (
                  <Calendar
                    mode="range"
                    numberOfMonths={NUMBER_OF_MONTHS_IN_CALENDAR}
                    defaultMonth={state.from}
                    selected={{
                      from: !state.from ? undefined : startOfWeek(state.from),
                      to: !state.from ? undefined : endOfWeek(state.from)
                    }}
                    onSelect={(range) => {
                      if (range === undefined || range.from === undefined || range.to === undefined) {
                        onDatesChange(startOfWeek(state.from!), endOfWeek(state.from!))
                        return
                      }

                      if (state.from?.toDateString() === range.from.toDateString()) {
                        onDatesChange(startOfWeek(range.to), endOfWeek(range.to))
                        return
                      }

                      onDatesChange(startOfWeek(range.from), endOfWeek(range.from))
                    }}
                  />
                )
              }
              {
                state.period === "monthly" && (
                  <Calendar
                    mode="range"
                    numberOfMonths={NUMBER_OF_MONTHS_IN_CALENDAR}
                    defaultMonth={state.from}
                    selected={{
                      from: !state.from ? undefined : startOfMonth(state.from),
                      to: !state.from ? undefined : endOfMonth(state.from)
                    }}
                    onSelect={(range) => {
                      if (range === undefined || range.from === undefined || range.to === undefined) {
                        onDatesChange(startOfMonth(state.from!), endOfMonth(state.from!))
                        return
                      }

                      if (state.from?.toDateString() === range.from.toDateString()) {
                        onDatesChange(startOfMonth(range.to), endOfMonth(range.to))
                        return
                      }

                      onDatesChange(startOfMonth(range.from), endOfMonth(range.from))
                    }}
                  />
                )
              }
              {
                state.period === "yearly" && (
                  <span>Here goes a year selector</span>
                )
              }
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant={"outline"}
                onClick={() => {
                  const { from, to, period } = defaultFilters()

                  setState({ type: _actions.FILTERS_CHANGED, from, to, period, touched: true })
                }}
              >
                <FunnelX /> Reset
              </Button>
              <Button
                type="button"
                onClick={() => {
                  const { from, to, period } = state

                  setState({ type: _actions.FILTERS_CHANGED, from, to, period, touched: true })
                }}
                disabled={!state.from || !state.to}
              >
                <FunnelPlus /> Apply
              </Button>
            </DialogFooter>
          </div>
        </SidebarProvider>
        {/* <div className="flex flex-col gap-2">
          <PeriodShortcuts
            onOpenRangePicker={(open) => setState({ type: _actions.RANGE_PICKER_OPENED, open })}
            onOpenDayPicker={(open) => setState({ type: _actions.DAY_PICKER_OPENED, open })}
            onFilterChange={onFilterChangeByShortcut}
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
        </div> */}
      </DialogContent>
    </Dialog>
  )
}
