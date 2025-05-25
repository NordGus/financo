import { use, useDeferredValue, useEffect, useMemo, useState } from "react"
import { AccountsContext } from "~/modules/ledger/contexts/accounts-context"
import { isAccount, isArchived } from "~/modules/ledger/types/accounts"
import { SidebarMenu, SidebarMenuItem } from "~/modules/shared/components/ui/sidebar"
import { Tabs, TabsList, TabsTrigger } from "~/modules/shared/components/ui/tabs"

type Tab = "active" | "archived"

interface Props {
  value: number[]
  onChange: (ids: number[]) => void
}

export function ByAccount({ value, onChange }: Props) {
  const { accounts } = use(AccountsContext)

  const [tab, setTab] = useState<Tab>("active")
  const [selected, __setSelected] = useState(value)
  const deferredSelected = useDeferredValue(selected)

  const __activeAccounts = useMemo(
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

  const __archivedAccounts = useMemo(
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

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
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
      </SidebarMenu>
    </>
  )
}