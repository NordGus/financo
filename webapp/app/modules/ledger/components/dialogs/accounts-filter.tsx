import { Funnel, FunnelPlus, Trash } from "lucide-react";
import { ComponentProps, use, useEffect, useReducer } from "react";
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
import { isAccount, isArchived } from "../../types/accounts";
import { Section } from "../picker-section";

interface Props {
  selected: number[]
  onApplyFilters: (ids: number[]) => void
}

type State = {
  ids: number[]
  open: boolean
}

const _actions = {
  OPEN_CHANGED: "OPEN_CHANGED",
  SELECTED_CHANGED: "SELECTED_CHANGED",
  OPEN_CHANGED_WITHOUT_APPLY: "OPEN_CHANGED_WITHOUT_APPLY",
  ADDED: "ADDED",
  REMOVED: "REMOVE",
  CLEARED: "CLEARED"
} as const

type Actions = typeof _actions

type Action =
  { type: Actions["OPEN_CHANGED"], open: boolean } |
  { type: Actions["SELECTED_CHANGED"], ids: number[] } |
  { type: Actions["OPEN_CHANGED_WITHOUT_APPLY"], open: boolean, ids: number[] } |
  { type: Actions["ADDED"], id: number } |
  { type: Actions["REMOVED"], id: number } |
  { type: Actions["CLEARED"] }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case _actions.OPEN_CHANGED:
      return { ...state, open: action.open }
    case _actions.SELECTED_CHANGED:
      return { ...state, ids: action.ids }
    case _actions.OPEN_CHANGED_WITHOUT_APPLY:
      return { ...state, open: action.open, ids: action.ids }
    case _actions.ADDED:
      return {
        ...state,
        ids: state.ids.includes(action.id) ? [...state.ids] : [...state.ids, action.id]
      }
    case _actions.REMOVED:
      return {
        ...state,
        ids: state.ids.filter(id => id !== action.id)
      }
    case _actions.CLEARED:
      return { open: false, ids: [] }
  }
}

function init(ids: number[]): State {
  return {
    ids,
    open: false
  }
}

export function AccountsFilter({
  selected,
  onApplyFilters,
  className,
  ...props
}: ComponentProps<typeof Button> & Props) {
  const [state, setState] = useReducer(reducer, selected, init)
  const { accounts } = use(AccountsContext)

  const activeAccounts = accounts.filter(account => isAccount(account) && !isArchived(account))
  const archivedAccounts = accounts.filter(account => isAccount(account) && isArchived(account))

  const onOpenChange = (open: boolean) =>
    setState({ type: _actions.OPEN_CHANGED_WITHOUT_APPLY, open, ids: selected })
  const onAdd = (id: number) =>
    setState({ type: _actions.ADDED, id })
  const onRemove = (id: number) =>
    setState({ type: _actions.REMOVED, id })
  const onApply = () => {
    setState({ type: _actions.OPEN_CHANGED, open: false })
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
              className={cn("cursor-pointer", className)}
              {...props}
            >
              <Funnel /> Accounts
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          Filter Transactions by Account
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter By Accounts</DialogTitle>
          <DialogDescription>
            {"Select which Accounts you to filter the ledger's transaction"}
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-[40dvh]">
          <Tabs defaultValue="active">
            <TabsList className="w-full">
              <TabsTrigger value={"active"}>Active</TabsTrigger>
              <TabsTrigger value={"archived"}>Archived</TabsTrigger>
            </TabsList>
            <TabsContent value={"active"} className="flex flex-wrap gap-2 max-h-[75dvh] overflow-y-auto">
              <Section
                accounts={activeAccounts.filter(({ kind }) => kind === "capital")}
                title="Capital"
                selected={state.ids}
                onAdd={onAdd}
                onRemove={onRemove}
              />
              <Section
                accounts={activeAccounts.filter(({ kind }) => kind === "savings")}
                title="Savings"
                selected={state.ids}
                onAdd={onAdd}
                onRemove={onRemove}
              />
              <Section
                accounts={activeAccounts.filter(({ kind }) => kind === "debt")}
                title="Debts"
                selected={state.ids}
                onAdd={onAdd}
                onRemove={onRemove}
              />
              <Section
                accounts={activeAccounts.filter(({ kind }) => kind === "credit")}
                title="Credit"
                selected={state.ids}
                onAdd={onAdd}
                onRemove={onRemove}
              />
            </TabsContent>
            <TabsContent value={"archived"} className="flex flex-wrap gap-2 max-h-[75dvh] overflow-y-auto">
              <Section
                accounts={archivedAccounts.filter(({ kind }) => kind === "capital")}
                title="Capital"
                selected={state.ids}
                onAdd={onAdd}
                onRemove={onRemove}
              />
              <Section
                accounts={archivedAccounts.filter(({ kind }) => kind === "savings")}
                title="Savings"
                selected={state.ids}
                onAdd={onAdd}
                onRemove={onRemove}
              />
              <Section
                accounts={archivedAccounts.filter(({ kind }) => kind === "debt")}
                title="Debts"
                selected={state.ids}
                onAdd={onAdd}
                onRemove={onRemove}
              />
              <Section
                accounts={archivedAccounts.filter(({ kind }) => kind === "credit")}
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
