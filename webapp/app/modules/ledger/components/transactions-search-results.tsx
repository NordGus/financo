import { useAccountsMap } from "../hooks/use-accounts-map"
import { useExecutedTransaction } from "../hooks/use-executed-transaction"
import { Transaction } from "../types/transactions"
import { DateGroup } from "./date-group"
import { Entry } from "./entry"
import { NoResults } from "./no-results"

type OnTransactionClick = (transaction: Transaction) => void

interface Props {
  onTransactionClick?: OnTransactionClick
}

export function TransactionsSearchResults({ }: Props) {
  const { empty: noData, data: transactions } = useExecutedTransaction()
  const accounts = useAccountsMap()

  if (noData) return <NoResults />

  return (
    <>
      <div className="flex flex-col">
        {
          transactions.map(([date, entries], idx) => (
            <DateGroup key={date} date={date} isFirst={idx === 0}>
              {entries.map((transaction) => {
                const source = accounts.get(transaction.sourceId)!
                const sourceParent = source.parentId === null ? null : accounts.get(source.parentId)!
                const target = accounts.get(transaction.targetId)!
                const targetParent = target.parentId === null ? null : accounts.get(target.parentId)!

                return (
                  <Entry
                    key={`${date}.${transaction.id}`}
                    transaction={transaction}
                    source={source}
                    sourceParent={sourceParent}
                    target={target}
                    targetParent={targetParent}
                  />
                )
              })}
            </DateGroup>
          ))
        }
      </div>
      <span className="content-[''] h-9 block my-2" />
    </>
  )
}