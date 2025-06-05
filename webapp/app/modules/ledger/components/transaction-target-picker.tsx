import { Fragment, use, useEffect, useMemo, useState } from "react"
import { Preview as AccountPreview } from "~/modules/shared/components/previews/accounts"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "~/modules/shared/components/ui/tabs"
import { AccountKind } from "~/modules/shared/types/account"
import { Currency } from "~/modules/shared/types/currency"
import { AccountsContext } from "../contexts/accounts-context"
import { Account } from "../types/accounts"
import { Kind } from "../types/transactions"
import { PreviewCategory } from "./previews/category"

interface Props {
  selected: number | null
  onSelected: (kind: Kind, id: number) => void
  kind?: Kind
  ignore?: number
}

interface Sections {
  income: Account[]
  expense: Account[]
  transfer: Account[]
}

function isIncome(account: Account) {
  switch (account.kind) {
    case "income":
      return true
    case "credit":
    case "debt":
      return account.capital > 0
    default:
      return false
  }
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

export function TransactionTargetPicker({ selected, onSelected, ignore, kind = "income" }: Props) {
  const [tab, setTab] = useState<Kind>(kind)

  const { accounts, accountsChildren } = use(AccountsContext)

  const sections = useMemo<Sections>(() => {
    const entries = Array.from(accounts.values())
      .filter(({ parentId }) => !parentId)
      .filter(({ archivedAt }) => !archivedAt)
      .filter(({ id }) => ignore !== id)

    return {
      income: entries.filter(isIncome),
      expense: entries.filter(isExpense),
      transfer: entries.filter(isTransfer)
    }
  }, [accounts])

  const onClick = (id: number) => onSelected(tab, id)

  useEffect(() => { setTab(kind) }, [kind])

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => {
        if (value === "income" || value === "expense" || value === "transfer") setTab(value)
        else setTab("income")
      }}
      defaultValue="income"
      className="flex flex-col grow overflow-hidden [&_[data-slot=tabs-content]]:overflow-y-auto [&_[data-slot=tabs-content]]:grow"
    >
      <TabsList className="w-full mb-2 *:cursor-pointer">
        <TabsTrigger value="income">Income</TabsTrigger>
        <TabsTrigger value="expense">Expense</TabsTrigger>
        <TabsTrigger value="transfer">Transfer</TabsTrigger>
      </TabsList>
      <TabsContent value="income" className="no-scrollbar">
        <div className="grid grid-cols-4 gap-2 items-start">
          {
            sections.income.filter(({ kind }) => kind === "income").map((account) => {
              const children = accountsChildren.get(account.id)?.
                filter(({ id, archivedAt }) => !archivedAt || id === selected)?.
                filter(({ id }) => id !== ignore || id === selected)

              return (
                <Fragment key={`target.account.income.${account.id}.group`}>
                  <PreviewCategory
                    key={`target.account.income.${account.id}`}
                    account={account}
                    onClick={() => onClick(account.id)}
                    selected={selected === account.id}
                  />
                  {
                    children?.map((child) => (
                      <PreviewCategory
                        key={`target.account.income.${child.id}`}
                        account={child}
                        parent={account}
                        onClick={() => onClick(child.id)}
                        selected={selected === child.id}
                      />
                    ))
                  }
                </Fragment>
              )
            })
          }
          {
            sections.income.filter(({ kind }) => kind !== "income").map((account) => (
              <PreviewCategory
                key={`target.account.income.${account.id}`}
                account={account}
                onClick={() => onClick(account.id)}
                selected={selected === account.id}
              />
            ))
          }
        </div>
      </TabsContent>
      <TabsContent value="expense" className="no-scrollbar">
        <div className="grid grid-cols-4 gap-2 items-start">
          {
            sections.expense.filter(({ kind }) => kind === "expense").map((account) => {
              const children = accountsChildren.get(account.id)?.
                filter(({ id, archivedAt }) => !archivedAt || id === selected)?.
                filter(({ id }) => id !== ignore || id === selected)

              return (
                <Fragment key={`target.account.expense.${account.id}.group`}>
                  <PreviewCategory
                    key={`target.account.expense.${account.id}`}
                    account={account}
                    onClick={() => onClick(account.id)}
                    selected={selected === account.id}
                  />
                  {
                    children?.map((child) => (
                      <PreviewCategory
                        key={`target.account.expense.${child.id}`}
                        account={child}
                        parent={account}
                        onClick={() => onClick(child.id)}
                        selected={selected === child.id}
                      />
                    ))
                  }
                </Fragment>
              )
            })
          }
          {
            sections.expense.filter(({ kind }) => kind !== "expense").map((account) => (
              <PreviewCategory
                key={`target.account.expense.${account.id}`}
                account={account}
                onClick={() => onClick(account.id)}
                selected={selected === account.id}
              />
            ))
          }
        </div>
      </TabsContent>
      <TabsContent value="transfer" className="no-scrollbar">
        {
          sections.transfer.filter(({ kind }) => kind === "capital").map((account, idx) => (
            <>
              {idx === 0 && <p className="text-xl mb-2">Capital</p>}
              <AccountPreview
                key={`target.account.transfer.${account.id}`}
                kind={account.kind as AccountKind}
                currency={account.currency as Currency}
                name={account.name}
                description={account.description}
                color={account.color}
                icon={account.icon}
                capital={account.capital}
                balance={account.balance}
                main={account.main}
                archivedAt={account.archivedAt}
                onClick={() => onClick(account.id)}
                selected={selected === account.id}
              />
            </>
          ))
        }
        {
          sections.transfer.filter(({ kind }) => kind === "savings").map((account, idx) => (
            <>
              {idx === 0 && <p className="text-xl mb-2">Savings</p>}
              <AccountPreview
                key={`target.account.transfer.${account.id}`}
                kind={account.kind as AccountKind}
                currency={account.currency as Currency}
                name={account.name}
                description={account.description}
                color={account.color}
                icon={account.icon}
                capital={account.capital}
                balance={account.balance}
                main={account.main}
                archivedAt={account.archivedAt}
                onClick={() => onClick(account.id)}
                selected={selected === account.id}
              />
            </>
          ))
        }
        {
          sections.transfer.filter(({ kind }) => kind === "debt").map((account, idx) => (
            <>
              {idx === 0 && <p className="text-xl mb-2">Debts</p>}
              <AccountPreview
                key={`target.account.transfer.${account.id}`}
                kind={account.kind as AccountKind}
                currency={account.currency as Currency}
                name={account.name}
                description={account.description}
                color={account.color}
                icon={account.icon}
                capital={account.capital}
                balance={account.balance}
                main={account.main}
                archivedAt={account.archivedAt}
                onClick={() => onClick(account.id)}
                selected={selected === account.id}
              />
            </>
          ))
        }
        {
          sections.transfer.filter(({ kind }) => kind === "credit").map((account, idx) => (
            <>
              {idx === 0 && <p className="text-xl mb-2">Credit</p>}
              <AccountPreview
                key={`target.account.transfer.${account.id}`}
                kind={account.kind as AccountKind}
                currency={account.currency as Currency}
                name={account.name}
                description={account.description}
                color={account.color}
                icon={account.icon}
                capital={account.capital}
                balance={account.balance}
                main={account.main}
                archivedAt={account.archivedAt}
                onClick={() => onClick(account.id)}
                selected={selected === account.id}
              />
            </>
          ))
        }
      </TabsContent>
    </Tabs>
  )
}
