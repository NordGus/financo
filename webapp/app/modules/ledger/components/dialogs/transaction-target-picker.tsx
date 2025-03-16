import { ComponentProps, useCallback, useMemo, useState } from "react"
import { AccountListingIcon } from "~/modules/shared/components/icons/account-icon"
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
import { currencyAmountColor } from "~/modules/shared/helpers/currency-amount-color"
import { currencyAmountToHuman } from "~/modules/shared/helpers/currency-amount-to-human"
import { useTransactionsStore } from "../../stores/transactions"
import { Account } from "../../types/accounts"

type TransactionKind = "income" | "expense" | "transfer"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (id: number, kind: TransactionKind) => void
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

export function TransactionTargetPicker({ open, onOpenChange, onSelect }: Props) {
  const [tab, setTab] = useState<TransactionKind>("income")

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

  const onAccountSelected = useCallback((id: number) => onSelect(id, tab), [tab, onSelect])

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
                  <IncomeOrExpense
                    key={`target.account.income.${account.id}`}
                    account={account}
                    onClick={() => onAccountSelected(account.id)}
                  />
                ))
              }
              {
                sections.income.filter(({ kind }) => kind !== "income").map((account) => (
                  <IncomeOrExpense
                    key={`target.account.income.${account.id}`}
                    account={account}
                    onClick={() => onAccountSelected(account.id)}
                  />
                ))
              }
            </div>
          </TabsContent>
          <TabsContent value="expense">
            <div className="grid grid-cols-4 gap-2 items-start">
              {
                sections.expense.filter(({ kind }) => kind === "expense").map((account) => (
                  <IncomeOrExpense
                    key={`target.account.expense.${account.id}`}
                    account={account}
                    onClick={() => onAccountSelected(account.id)}
                  />
                ))
              }
              {
                sections.expense.filter(({ kind }) => kind !== "expense").map((account) => (
                  <IncomeOrExpense
                    key={`target.account.expense.${account.id}`}
                    account={account}
                    onClick={() => onAccountSelected(account.id)}
                  />
                ))
              }
            </div>
          </TabsContent>
          <TabsContent value="transfer">
            <p className="text-xl mb-2">Capital</p>
            {
              sections.transfer.filter(({ kind }) => kind === "capital").map((account) => (
                <Transfer
                  key={`target.account.transfer.${account.id}`}
                  account={account}
                  onClick={() => onAccountSelected(account.id)}
                />
              ))
            }
            <p className="text-xl mb-2">Savings</p>
            {
              sections.transfer.filter(({ kind }) => kind === "savings").map((account) => (
                <Transfer
                  key={`target.account.transfer.${account.id}`}
                  account={account}
                  onClick={() => onAccountSelected(account.id)}
                />
              ))
            }
            <p className="text-xl mb-2">Debts</p>
            {
              sections.transfer.filter(({ kind }) => kind === "debt").map((account) => (
                <Transfer
                  key={`target.account.transfer.${account.id}`}
                  account={account}
                  onClick={() => onAccountSelected(account.id)}
                />
              ))
            }
            <p className="text-xl mb-2">Credit</p>
            {
              sections.transfer.filter(({ kind }) => kind === "credit").map((account) => (
                <Transfer
                  key={`target.account.transfer.${account.id}`}
                  account={account}
                  onClick={() => onAccountSelected(account.id)}
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


interface IncomeOrExpenseProps {
  account: Account
}

function IncomeOrExpense({ account, onClick }: ComponentProps<"div"> & IncomeOrExpenseProps) {
  return (
    <div onClick={onClick} className="flex flex-col justify-center items-center gap-2">
      <AccountListingIcon
        kind={account.kind}
        icon={account.icon}
        color={account.color}
        main={account.main}
        className="row-span-2"
      />
      <p className="text-xs text-center">{account.name}</p>
    </div>
  )
}

interface TransferProps {
  account: Account
}

function Transfer({ account, onClick }: ComponentProps<"div"> & TransferProps) {
  const debt = account.capital + account.balance

  return (
    <div
      className="grid grid-cols-[min-content_1fr] gap-2 mb-1"
      onClick={onClick}
    >
      <AccountListingIcon
        kind={account.kind}
        icon={account.icon}
        color={account.color}
        main={account.main}
        className="row-span-2"
      />
      <div className="flex flex-col gap-1 [&_>*]:leading-none">
        <p>{account.name}</p>
        <p className="text-muted-foreground text-xs">{account.description}</p>
      </div>
      <p className="text-sm">
        {
          (account.kind === "capital" || account.kind === "savings") && (
            <span className={currencyAmountColor(account.balance)}>
              {currencyAmountToHuman(account.balance, account.currency)}
            </span>
          )
        }
        {
          account.kind === "debt" && (
            <>
              <span className={currencyAmountColor(debt)}>
                {currencyAmountToHuman(debt, account.currency)}
              </span>{" "}
              <span>owed out of</span>{" "}
              <span className={currencyAmountColor(account.capital)}>
                {currencyAmountToHuman(account.capital, account.currency)}
              </span>
            </>
          )
        }
        {
          account.kind === "credit" && (
            <>
              <span className={currencyAmountColor(debt)}>
                {currencyAmountToHuman(debt, account.currency)}
              </span>{" "}
              <span>owed with</span>{" "}
              <span className={currencyAmountColor(account.balance)}>
                {currencyAmountToHuman(account.balance, account.currency)}
              </span>{" "}
              <span>available</span>
            </>
          )
        }
      </p>
    </div>
  )
}