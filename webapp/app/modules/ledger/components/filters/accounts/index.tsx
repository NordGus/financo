import { ChevronRight, CreditCard, HandCoins, Landmark, PiggyBank } from "lucide-react"
import { DynamicIcon } from "lucide-react/dynamic"
import { use, useDeferredValue, useEffect, useMemo, useState } from "react"
import { AccountsContext } from "~/modules/ledger/contexts/accounts-context"
import { isAccount, isArchived } from "~/modules/ledger/types/accounts"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/modules/shared/components/ui/collapsible"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from "~/modules/shared/components/ui/sidebar"
import { Tabs, TabsList, TabsTrigger } from "~/modules/shared/components/ui/tabs"

type Tab = "active" | "archived"

interface Props {
  value: number[]
  onChange: (ids: number[]) => void
}

export function ByAccount({ value, onChange }: Props) {
  const { accounts } = use(AccountsContext)

  const [tab, setTab] = useState<Tab>("active")
  const [selected, setSelected] = useState(value)
  const deferredSelected = useDeferredValue(selected)

  const activeAccounts = useMemo(
    () => {
      const filteredAccounts = accounts.filter(account => isAccount(account) && !isArchived(account))

      return {
        capital: filteredAccounts.filter(account => account.kind === "capital"),
        savings: filteredAccounts.filter(account => account.kind === "savings"),
        debts: filteredAccounts.filter(account => account.kind === "debt"),
        credit: filteredAccounts.filter(account => account.kind === "credit"),
      }
    },
    [accounts]
  )

  const archivedAccounts = useMemo(
    () => {
      const filteredAccounts = accounts.filter(account => isAccount(account) && isArchived(account))

      return {
        capital: filteredAccounts.filter(account => account.kind === "capital"),
        savings: filteredAccounts.filter(account => account.kind === "savings"),
        debts: filteredAccounts.filter(account => account.kind === "debt"),
        credit: filteredAccounts.filter(account => account.kind === "credit"),
      }
    },
    [accounts]
  )

  useEffect(() => {
    onChange(deferredSelected)
  }, [deferredSelected])

  const accountsToDisplay = tab === "active" ? activeAccounts : archivedAccounts

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem className="py-1">
          <Tabs value={tab} onValueChange={(value) => setTab(value as Tab)}>
            <TabsList className="w-full">
              <TabsTrigger value="active">
                Active
              </TabsTrigger>
              <TabsTrigger value="archived">
                Archived
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </SidebarMenuItem>
        {!!accountsToDisplay.capital.length && (
          <SidebarMenuItem>
            <Collapsible
              className="group/collapsible [&[data-state=open]>button>svg:last-child]:rotate-90"
              defaultOpen={true}
            >
              <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                  <span className="flex-1 flex items-center gap-2 [&>svg]:size-5 [&>svg]:shrink-0">
                    <Landmark /> Capital
                  </span>
                  <ChevronRight className="transition-transform" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {
                    accountsToDisplay.capital.map((account) => {
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
        {!!accountsToDisplay.savings.length && (
          <SidebarMenuItem>
            <Collapsible
              className="group/collapsible [&[data-state=open]>button>svg:last-child]:rotate-90"
              defaultOpen={!accountsToDisplay.capital.length}
            >
              <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                  <span className="flex-1 flex items-center gap-2 [&>svg]:size-5 [&>svg]:shrink-0">
                    <PiggyBank /> Savings
                  </span>
                  <ChevronRight className="transition-transform" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {
                    accountsToDisplay.savings.map((account) => {
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
                !accountsToDisplay.capital.length &&
                !accountsToDisplay.savings.length
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
                !accountsToDisplay.capital.length &&
                !accountsToDisplay.savings.length &&
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
    </>
  )
}