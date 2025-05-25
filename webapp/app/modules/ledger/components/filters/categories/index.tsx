import { ArrowDown, ArrowUp, ChevronRight, CreditCard, HandCoins } from "lucide-react"
import { DynamicIcon } from "lucide-react/dynamic"
import { use, useDeferredValue, useEffect, useMemo, useState } from "react"
import { AccountsContext } from "~/modules/ledger/contexts/accounts-context"
import { isArchived, isCategory, isDebt } from "~/modules/ledger/types/accounts"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "~/modules/shared/components/ui/collapsible"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~/modules/shared/components/ui/select"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub
} from "~/modules/shared/components/ui/sidebar"

type Tab = "active" | "archived"

interface Props {
  value: number[]
  onChange: (ids: number[]) => void
}

export function ByCategory({ value, onChange }: Props) {
  const { accounts } = use(AccountsContext)

  const [tab, setTab] = useState<Tab>("active")
  const [selected, setSelected] = useState(value)
  const deferredSelected = useDeferredValue(selected)

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

  useEffect(() => {
    onChange(deferredSelected)
  }, [deferredSelected])

  useEffect(() => {
    if (
      value.length === selected.length &&
      value.every(id => selected.includes(id))
    ) return

    setSelected(value)
  }, [value])

  const accountsToDisplay = tab === "active" ? activeCategories : archivedCategories

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Select value={tab} onValueChange={(value) => setTab(value as Tab)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </SidebarMenuItem>
      {!!accountsToDisplay.expenses.length && (
        <SidebarMenuItem>
          <Collapsible
            className="group/collapsible [&[data-state=open]>button>svg:last-child]:rotate-90"
            defaultOpen={true}
          >
            <CollapsibleTrigger asChild>
              <SidebarMenuButton>
                <span className="flex-1 flex items-center gap-2 [&>svg]:size-5 [&>svg]:shrink-0">
                  <ArrowDown /> Expenses
                </span>
                <ChevronRight className="transition-transform" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {
                  accountsToDisplay.expenses.map((account) => {
                    const isActive = selected.includes(account.id)

                    return (
                      <SidebarMenuItem
                        key={`account.${account.id}`}
                      >
                        <SidebarMenuButton
                          isActive={selected.includes(account.id)}
                          onClick={() => setSelected(prev => {
                            if (isActive) return prev.filter(id => id !== account.id)
                            return [...prev, account.id]
                          })}
                          className="overflow-ellipsis"
                          tooltip={{
                            hidden: false,
                            children: account.name
                          }}
                        >
                          <DynamicIcon name={account.icon} /> <span>{account.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })
                }
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenuItem>
      )}
      {!!accountsToDisplay.income.length && (
        <SidebarMenuItem>
          <Collapsible
            className="group/collapsible [&[data-state=open]>button>svg:last-child]:rotate-90"
            defaultOpen={!accountsToDisplay.expenses.length}
          >
            <CollapsibleTrigger asChild>
              <SidebarMenuButton>
                <span className="flex-1 flex items-center gap-2 [&>svg]:size-5 [&>svg]:shrink-0">
                  <ArrowUp /> Income
                </span>
                <ChevronRight className="transition-transform" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {
                  accountsToDisplay.income.map((account) => {
                    const isActive = selected.includes(account.id)

                    return (
                      <SidebarMenuItem
                        key={`account.${account.id}`}
                      >
                        <SidebarMenuButton
                          isActive={selected.includes(account.id)}
                          onClick={() => setSelected(prev => {
                            if (isActive) return prev.filter(id => id !== account.id)
                            return [...prev, account.id]
                          })}
                          className="overflow-ellipsis"
                          tooltip={{
                            hidden: false,
                            children: account.name
                          }}
                        >
                          <DynamicIcon name={account.icon} /> <span>{account.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })
                }
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenuItem>
      )}
      {!!accountsToDisplay.debts.length && (
        <SidebarMenuItem>
          <Collapsible
            className="group/collapsible [&[data-state=open]>button>svg:last-child]:rotate-90"
            defaultOpen={
              !accountsToDisplay.expenses.length &&
              !accountsToDisplay.income.length
            }
          >
            <CollapsibleTrigger asChild>
              <SidebarMenuButton>
                <span className="flex-1 flex items-center gap-2 [&>svg]:size-5 [&>svg]:shrink-0">
                  <HandCoins /> Debts
                </span>
                <ChevronRight className="transition-transform" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {
                  accountsToDisplay.debts.map((account) => {
                    const isActive = selected.includes(account.id)

                    return (
                      <SidebarMenuItem
                        key={`account.${account.id}`}
                      >
                        <SidebarMenuButton
                          isActive={selected.includes(account.id)}
                          onClick={() => setSelected(prev => {
                            if (isActive) return prev.filter(id => id !== account.id)
                            return [...prev, account.id]
                          })}
                          className="overflow-ellipsis"
                          tooltip={{
                            hidden: false,
                            children: account.name
                          }}
                        >
                          <DynamicIcon name={account.icon} /> <span>{account.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })
                }
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenuItem>
      )}
      {!!accountsToDisplay.credit.length && (
        <SidebarMenuItem>
          <Collapsible
            className="group/collapsible [&[data-state=open]>button>svg:last-child]:rotate-90"
            defaultOpen={
              !accountsToDisplay.expenses.length &&
              !accountsToDisplay.income.length &&
              !accountsToDisplay.debts.length
            }
          >
            <CollapsibleTrigger asChild>
              <SidebarMenuButton>
                <span className="flex-1 flex items-center gap-2 [&>svg]:size-5 [&>svg]:shrink-0">
                  <CreditCard /> Credit
                </span>
                <ChevronRight className="transition-transform" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {
                  accountsToDisplay.credit.map((account) => {
                    const isActive = selected.includes(account.id)

                    return (
                      <SidebarMenuItem
                        key={`account.${account.id}`}
                      >
                        <SidebarMenuButton
                          isActive={selected.includes(account.id)}
                          onClick={() => setSelected(prev => {
                            if (isActive) return prev.filter(id => id !== account.id)
                            return [...prev, account.id]
                          })}
                          className="overflow-ellipsis"
                          tooltip={{
                            hidden: false,
                            children: account.name
                          }}
                        >
                          <DynamicIcon name={account.icon} /> <span>{account.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })
                }
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  )
}