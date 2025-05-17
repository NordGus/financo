import { Funnel, FunnelPlus, Trash } from "lucide-react";
import { ComponentProps, use, useEffect, useMemo, useReducer } from "react";
import { cn } from "~/lib/utils";
import { Button } from "~/modules/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/modules/shared/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/modules/shared/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/modules/shared/components/ui/tooltip";
import { AccountsContext } from "../../contexts/accounts-context";
import { isArchived, isCategory, isDebt } from "../../types/accounts";
import { Section } from "../picker-section";

interface Props {
  selected: number[]
  onApplyFilters: (ids: number[]) => void
}

type State = {
  ids: number[]
  open: boolean
  fromAction: boolean
}

const _actions = {
  OPEN_CHANGED: "OPEN_CHANGED",
  SELECTED_CHANGED: "SELECTED_CHANGED",
  ADDED: "ADDED",
  REMOVED: "REMOVE",
  CLEARED: "CLEARED"
} as const

type Actions = typeof _actions

type Action =
  { type: Actions["OPEN_CHANGED"], fromAction: boolean, open: boolean, ids?: number[] } |
  { type: Actions["SELECTED_CHANGED"], ids: number[] } |
  { type: Actions["ADDED"], id: number } |
  { type: Actions["REMOVED"], id: number } |
  { type: Actions["CLEARED"] }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case _actions.OPEN_CHANGED:
      return {
        ...state,
        open: action.open,
        fromAction: action.fromAction,
        ids: state.fromAction
          ? state.ids :
          action.ids ?? []
      }
    case _actions.SELECTED_CHANGED:
      return { ...state, ids: action.ids }
    case _actions.ADDED:
      return {
        ...state,
        ids: state.ids.includes(action.id)
          ? [...state.ids]
          : [...state.ids, action.id]
      }
    case _actions.REMOVED:
      return {
        ...state,
        ids: state.ids.filter(id => id !== action.id)
      }
    case _actions.CLEARED:
      return { open: false, fromAction: true, ids: [] }
  }
}

function init(ids: number[]): State {
  return {
    ids,
    open: false,
    fromAction: false
  }
}

export function CategoriesFilter({
  selected,
  onApplyFilters,
  className,
  ...props
}: ComponentProps<typeof Button> & Props) {
  const [state, setState] = useReducer(reducer, selected, init)
  const { accounts } = use(AccountsContext)

  const activeCategories = useMemo(() => {
    const filtered = accounts.filter(account => (isCategory(account) || isDebt(account)) && !isArchived(account))

    return {
      expenses: filtered.filter(({ kind }) => kind === "expense"),
      income: filtered.filter(({ kind }) => kind === "income"),
      debts: filtered.filter(({ kind }) => kind === "debt"),
      credit: filtered.filter(({ kind }) => kind === "credit"),
    }
  }, [accounts])

  const archivedCategories = useMemo(() => {
    const filtered = accounts.filter(account => (isCategory(account) || isDebt(account)) && isArchived(account))

    return {
      expenses: filtered.filter(({ kind }) => kind === "expense"),
      income: filtered.filter(({ kind }) => kind === "income"),
      debts: filtered.filter(({ kind }) => kind === "debt"),
      credit: filtered.filter(({ kind }) => kind === "credit"),
    }
  }, [accounts])

  const onOpenChange = (open: boolean) =>
    setState({ type: _actions.OPEN_CHANGED, open, fromAction: false, ids: selected })
  const onAdd = (id: number) =>
    setState({ type: _actions.ADDED, id })
  const onRemove = (id: number) =>
    setState({ type: _actions.REMOVED, id })
  const onApply = () => {
    setState({ type: _actions.OPEN_CHANGED, open: false, fromAction: true, ids: state.ids })
    onApplyFilters(state.ids)
  }
  const onReset = () => {
    setState({ type: _actions.CLEARED })
    onApplyFilters([])
  }

  useEffect(() => {
    setState({ type: _actions.SELECTED_CHANGED, ids: selected })
  }, [selected])

  return (
    <Dialog open={state.open} onOpenChange={onOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant={"outline"}
              className={cn("cursor-pointer relative", className)}
              {...props}
            >
              <Funnel /> Categories
              {
                state.ids.length > 0 && (
                  <span className="bg-foreground rounded-full size-4 text-xs text-accent absolute -top-1 -right-1">
                    {state.ids.length}
                  </span>
                )
              }
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          Filter Transactions by Category
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter By Category</DialogTitle>
          <DialogDescription>
            {"Select which Categories you to filter transactions by"}
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-[40dvh]">
          <Tabs defaultValue="active">
            <TabsList className="w-full">
              <TabsTrigger value={"active"}>Active</TabsTrigger>
              <TabsTrigger value={"archived"}>Archived</TabsTrigger>
            </TabsList>
            <TabsContent value={"active"} className="flex flex-wrap gap-2 max-h-[75dvh] overflow-y-auto no-scrollbar">
              <Section
                accounts={activeCategories.expenses}
                title="Expenses"
                selected={state.ids}
                onAdd={onAdd}
                onRemove={onRemove}
              />
              <Section
                accounts={activeCategories.income}
                title="Income"
                selected={state.ids}
                onAdd={onAdd}
                onRemove={onRemove}
              />
              <Section
                accounts={activeCategories.debts}
                title="Debts"
                selected={state.ids}
                onAdd={onAdd}
                onRemove={onRemove}
              />
              <Section
                accounts={activeCategories.credit}
                title="Credit"
                selected={state.ids}
                onAdd={onAdd}
                onRemove={onRemove}
              />
            </TabsContent>
            <TabsContent value={"archived"} className="flex flex-wrap gap-2 max-h-[75dvh] overflow-y-auto no-scrollbar">
              <Section
                accounts={archivedCategories.expenses}
                title="Expenses"
                selected={state.ids}
                onAdd={onAdd}
                onRemove={onRemove}
              />
              <Section
                accounts={archivedCategories.income}
                title="Income"
                selected={state.ids}
                onAdd={onAdd}
                onRemove={onRemove}
              />
              <Section
                accounts={archivedCategories.debts}
                title="Debts"
                selected={state.ids}
                onAdd={onAdd}
                onRemove={onRemove}
              />
              <Section
                accounts={archivedCategories.credit}
                title="Credit"
                selected={state.ids}
                onAdd={onAdd}
                onRemove={onRemove}
              />
            </TabsContent>
          </Tabs>
        </div>
        <DialogFooter>
          <Button variant={"outline"} onClick={onReset}>
            <Trash /> Reset
          </Button>
          <Button onClick={onApply}>
            <FunnelPlus /> Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
