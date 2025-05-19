import { Funnel, FunnelPlus, FunnelX } from "lucide-react";
import { ComponentProps, use, useEffect, useReducer } from "react";
import { cn } from "~/lib/utils";
import { Button } from "~/modules/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { DateFilters } from "./date-filters";

type DateFilterState = {
  open: boolean
  from?: Date
  to?: Date
  period: Period
  touched: boolean
  section: "dates" | "accounts" | "categories"
  accountSubsection: "active" | "archived"
  accounts: number[]
  categories: number[]
}

const _actions = {
  ACCOUNT_SUBSECTION_CHANGED: "ACCOUNT_SUBSECTION_CHANGED",
  OPEN_CHANGED: "OPEN_CHANGED",
  PERIOD_CHANGED: "PERIOD_CHANGED",
  DATES_CHANGED: "DATES_CHANGED",
  FILTERS_CHANGED: "FILTERS_CHANGED",
} as const;

type Actions = typeof _actions

type Action =
  {
    type: Actions["OPEN_CHANGED"],
    open: boolean,
    touched: boolean,
    from?: Date,
    to?: Date,
    period: Period,
    accounts: number[],
    categories: number[],
  } |
  {
    type: Actions["FILTERS_CHANGED"],
    from?: Date,
    to?: Date,
    period: Period,
    accounts: number[],
    categories: number[],
    touched: boolean
  } |
  { type: Actions["PERIOD_CHANGED"], period: Period } |
  { type: Actions["DATES_CHANGED"], from?: Date, to?: Date } |
  { type: Actions["ACCOUNT_SUBSECTION_CHANGED"], section: "accounts" | "categories", subSection: "active" | "archived" }

function reducer(state: DateFilterState, action: Action): DateFilterState {
  switch (action.type) {
    case _actions.OPEN_CHANGED:
      return {
        ...state,
        from: action.from,
        to: action.to,
        period: action.period,
        accounts: action.accounts,
        categories: action.categories,
        open: action.open,
        touched: action.touched
      }
    case _actions.PERIOD_CHANGED:
      return {
        ...state,
        section: "dates",
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
        ...state,
        open: false,
        from: action.from,
        to: action.to,
        period: action.period,
        accounts: action.accounts,
        categories: action.categories,
        touched: action.touched
      }
    case _actions.ACCOUNT_SUBSECTION_CHANGED:
      return {
        ...state,
        section: action.section,
        accountSubsection: action.subSection
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
      accounts: filters.accounts,
      categories: filters.categories,
      open: false,
      touched: false,
      section: "dates",
      accountSubsection: "active"
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

  const onPeriodChange = (period: Period) =>
    setState({ type: _actions.PERIOD_CHANGED, period })
  const onDatesChange = (from?: Date, to?: Date) =>
    setState({ type: _actions.DATES_CHANGED, from, to })
  const onAccountSubSectionChange = (section: "accounts" | "categories", subSection: "active" | "archived") =>
    setState({ type: _actions.ACCOUNT_SUBSECTION_CHANGED, section, subSection })

  // I'm using an effect because is the only way I have to ensure that dialog's close animation is not interrupted,
  // by the internal navigation triggered by the filters changing.
  useEffect(() => {
    if (!state.touched) return () => { } // prevents a new redirect when resetting the dialog's state

    const { from, to, period, accounts, categories } = state

    const timer = setTimeout(
      () => setFilters(prev => ({ ...prev, from, to, period, accounts, categories })),
      160 // the animation seems to last 150 ms. This is a hack and i need to find a way to prevent rerender before the
      // dialog is fully closed.
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
      accounts: filters.accounts,
      categories: filters.categories,
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
          accounts: filters.accounts,
          categories: filters.categories,
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
                        isActive={state.section === "dates" && state.period === "custom"}
                      >
                        {"By Date Range"}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem key={"date.filter.day"}>
                      <SidebarMenuButton
                        onClick={() => onPeriodChange("daily")}
                        isActive={state.section === "dates" && state.period === "daily"}
                      >
                        {"By Day"}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem key={"date.filter.week"}>
                      <SidebarMenuButton
                        onClick={() => onPeriodChange("weekly")}
                        isActive={state.section === "dates" && state.period === "weekly"}
                      >
                        {"By Week"}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem key={"date.filter.month"}>
                      <SidebarMenuButton
                        onClick={() => onPeriodChange("monthly")}
                        isActive={state.section === "dates" && state.period === "monthly"}
                      >
                        {"By Month"}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem key={"date.filter.year"}>
                      <SidebarMenuButton
                        onClick={() => onPeriodChange("yearly")}
                        isActive={state.section === "dates" && state.period === "yearly"}
                      >
                        {"By Year"}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel>
                  Accounts
                </SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem key={"accounts.filter.active"}>
                    <SidebarMenuButton
                      onClick={() => onAccountSubSectionChange("accounts", "active")}
                      isActive={state.section === "accounts" && state.accountSubsection === "active"}
                    >
                      Active
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem key={"accounts.filter.archived"}>
                    <SidebarMenuButton
                      onClick={() => onAccountSubSectionChange("accounts", "archived")}
                      isActive={state.section === "accounts" && state.accountSubsection === "archived"}
                    >
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
                    <SidebarMenuButton
                      onClick={() => onAccountSubSectionChange("categories", "active")}
                      isActive={state.section === "categories" && state.accountSubsection === "active"}
                    >
                      Active
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem key={"accounts.filter.archived"}>
                    <SidebarMenuButton
                      onClick={() => onAccountSubSectionChange("categories", "archived")}
                      isActive={state.section === "categories" && state.accountSubsection === "archived"}
                    >
                      Archived
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <div className="flex-1 overflow-hidden flex flex-col p-4 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px] gap-2">
            {
              state.section === "dates" && (
                <DateFilters
                  from={state.from}
                  to={state.to}
                  period={state.period}
                  onDatesChange={onDatesChange}
                />
              )
            }
            <DialogFooter>
              <Button
                type="button"
                variant={"outline"}
                onClick={() => {
                  const { from, to, period, accounts, categories } = defaultFilters()

                  setState({ type: _actions.FILTERS_CHANGED, from, to, period, accounts, categories, touched: true })
                }}
              >
                <FunnelX /> Reset
              </Button>
              <Button
                type="button"
                onClick={() => {
                  const { from, to, period, accounts, categories } = state

                  setState({ type: _actions.FILTERS_CHANGED, from, to, period, accounts, categories, touched: true })
                }}
                disabled={!state.from || !state.to}
              >
                <FunnelPlus /> Apply
              </Button>
            </DialogFooter>
          </div>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}
