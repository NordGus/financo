import { useContext, useMemo, useState } from "react"
import { Button } from "~/modules/shared/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "~/modules/shared/components/ui/drawer"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "~/modules/shared/components/ui/tabs"
import { CreationContext, OnTargetChangeCallback } from "../../contexts/creation"
import { useTransactionsStore } from "../../stores/transactions"
import { Account } from "../../types/accounts"
import { Kind } from "../../types/transactions"
import { PreviewAccount } from "../previews/account"
import { PreviewCategory } from "../previews/category"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelected?: OnTargetChangeCallback
}

interface Sections {
  income: Account[]
  expense: Account[]
  transfer: Account[]
}

function isIncome(account: Account) {
  if (account.kind === "income") return true

  return (account.kind === "debt" || account.kind === "credit") && account.capital > 0
}

function isExpense(account: Account) {
  switch (account.kind) {
    case "expense":
      return true
    case "credit":
    case "debt":
      return account.capital < 0
    default:
      return false
  }
}

function isTransfer(account: Account) {
  switch (account.kind) {
    case "capital":
    case "savings":
    case "credit":
    case "debt":
      return true
    default:
      return false
  }
}

export function TransactionTargetPicker({ open, onOpenChange, onSelected }: Props) {
  const { kind, onTargetChange } = useContext(CreationContext)

  const [tab, setTab] = useState<Kind>(kind)

  const accounts = useTransactionsStore((state) => state.accounts)

  const sections = useMemo<Sections>(() => {
    const entries = Array.from(accounts.values())
      .filter(({ parentId }) => !parentId)
      .filter(({ archivedAt }) => !archivedAt)

    return {
      income: entries.filter(isIncome),
      expense: entries.filter(isExpense),
      transfer: entries.filter(isTransfer)
    }
  }, [accounts])

  const onClick = (id: number) =>
    onTargetChange(tab, id, onSelected)

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="hidden">
          <DrawerTitle>Target Account</DrawerTitle>
          <DrawerDescription>Select the Transactions target Account</DrawerDescription>
        </DrawerHeader>
        <Tabs
          value={tab}
          onValueChange={(value) => {
            if (value === "income" || value === "expense" || value === "transfer") setTab(value)
            else setTab("income")
          }}
          defaultValue="income"
          className="flex flex-col pt-2 px-4 min-h-[70dvh] max-h-[70dvh] [&_[data-slot=tabs-content]]:grow [&_[data-slot=tabs-content]]:overflow-y-auto [&_[data-slot=tabs-content]]:pt-4"
        >
          <TabsList className="w-full">
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expense">Expense</TabsTrigger>
            <TabsTrigger value="transfer">Transfer</TabsTrigger>
          </TabsList>
          <TabsContent value="income">
            <div className="grid grid-cols-4 gap-2 items-start">
              {
                sections.income.filter(({ kind }) => kind === "income").map((account) => (
                  <PreviewCategory
                    key={`target.account.income.${account.id}`}
                    account={account}
                    onClick={() => onClick(account.id)}
                  />
                ))
              }
              {
                sections.income.filter(({ kind }) => kind !== "income").map((account) => (
                  <PreviewCategory
                    key={`target.account.income.${account.id}`}
                    account={account}
                    onClick={() => onClick(account.id)}
                  />
                ))
              }
            </div>
          </TabsContent>
          <TabsContent value="expense">
            <div className="grid grid-cols-4 gap-2 items-start">
              {
                sections.expense.filter(({ kind }) => kind === "expense").map((account) => (
                  <PreviewCategory
                    key={`target.account.expense.${account.id}`}
                    account={account}
                    onClick={() => onClick(account.id)}
                  />
                ))
              }
              {
                sections.expense.filter(({ kind }) => kind !== "expense").map((account) => (
                  <PreviewCategory
                    key={`target.account.expense.${account.id}`}
                    account={account}
                    onClick={() => onClick(account.id)}
                  />
                ))
              }
            </div>
          </TabsContent>
          <TabsContent value="transfer">
            <p className="text-xl mb-2">Capital</p>
            {
              sections.transfer.filter(({ kind }) => kind === "capital").map((account) => (
                <PreviewAccount
                  key={`target.account.transfer.${account.id}`}
                  account={account}
                  onClick={() => onClick(account.id)}
                />
              ))
            }
            <p className="text-xl mb-2">Savings</p>
            {
              sections.transfer.filter(({ kind }) => kind === "savings").map((account) => (
                <PreviewAccount
                  key={`target.account.transfer.${account.id}`}
                  account={account}
                  onClick={() => onClick(account.id)}
                />
              ))
            }
            <p className="text-xl mb-2">Debts</p>
            {
              sections.transfer.filter(({ kind }) => kind === "debt").map((account) => (
                <PreviewAccount
                  key={`target.account.transfer.${account.id}`}
                  account={account}
                  onClick={() => onClick(account.id)}
                />
              ))
            }
            <p className="text-xl mb-2">Credit</p>
            {
              sections.transfer.filter(({ kind }) => kind === "credit").map((account) => (
                <PreviewAccount
                  key={`target.account.transfer.${account.id}`}
                  account={account}
                  onClick={() => onClick(account.id)}
                />
              ))
            }
          </TabsContent>
        </Tabs>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant={"outline"}>
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer >
  )
}
