import { use, useDeferredValue, useEffect, useMemo, useState } from "react"
import { AccountsContext } from "~/modules/ledger/contexts/accounts-context"
import { isArchived, isCategory, isDebt } from "~/modules/ledger/types/accounts"
import { SidebarMenu, SidebarMenuItem } from "~/modules/shared/components/ui/sidebar"
import { Tabs, TabsList, TabsTrigger } from "~/modules/shared/components/ui/tabs"

type Tab = "active" | "archived"

interface Props {
  value: number[]
  onChange: (ids: number[]) => void
}

export function ByCategory({ value, onChange }: Props) {
  const { accounts } = use(AccountsContext)

  const [tab, setTab] = useState<Tab>("active")
  const [selected, __setSelected] = useState(value)
  const deferredSelected = useDeferredValue(selected)

  const __activeCategories = useMemo(() => {
    const filtered = accounts.filter(account => (isCategory(account) || isDebt(account)) && !isArchived(account))

    return {
      expenses: filtered.filter(({ kind }) => kind === "expense"),
      income: filtered.filter(({ kind }) => kind === "income"),
      debts: filtered.filter(({ kind }) => kind === "debt"),
      credit: filtered.filter(({ kind }) => kind === "credit"),
    }
  }, [accounts])

  const __archivedCategories = useMemo(() => {
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