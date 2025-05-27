import { use, useMemo } from "react"
import { AccountsContext } from "../contexts/accounts-context"
import { Transaction, Transactions } from "../types/transactions"
import { DateGroup } from "./date-group"
import { Entry } from "./entry"
import { NoResults } from "./no-results"

type OnTransactionClick = (transaction: Transaction) => void

interface Props {
  transactions: Transactions
  onTransactionClick?: OnTransactionClick
  futureEnable?: boolean
}

export function TransactionsSearchResults({ transactions, futureEnable = false }: Props) {
  const { accountsMap: accounts } = use(AccountsContext)

  const last = useMemo(() => transactions.length - 1, [transactions.length])

  if (transactions.length === 0) return <NoResults />

  return transactions.map(([date, entries], idx) => (
    <DateGroup key={date} date={date} isLast={idx === last}>
      {entries.map((transaction) => {
        const source = accounts.get(transaction.sourceId)!
        const sourceParent = accounts.get(source.parentId ?? -1) ?? null
        const target = accounts.get(transaction.targetId)!
        const targetParent = accounts.get(target.parentId ?? -1) ?? null

        return (
          <Entry
            key={`${date}.${transaction.id}`}
            transaction={transaction}
            source={source}
            sourceParent={sourceParent}
            target={target}
            targetParent={targetParent}
            futureEnable={futureEnable}
          />
        )
      })}
    </DateGroup>
  ))
}