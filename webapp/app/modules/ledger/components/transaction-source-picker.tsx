import { use, useCallback, useMemo } from "react"
import { Kind as AccountKind } from "~/modules/shared/types/account"
import { AccountsContext } from "../contexts/accounts-context"
import { Account } from "../types/accounts"
import { PreviewAccount } from "./previews/account"

interface Props {
  target: number
  onSelected: (id: number) => void
}

export function TransactionSourcePicker({ target, onSelected }: Props) {
  const { accounts } = use(AccountsContext)

  const selectableAccounts = useMemo<Account[]>(() => {
    return Array.from(accounts.values())
      .filter(({ parentId }) => !parentId)
      .filter(({ archivedAt }) => !archivedAt)
      .filter(({ id }) => id !== target)
  }, [accounts, target])

  const accountsFor = useCallback((kind: AccountKind): Account[] => {
    return selectableAccounts.filter(({ kind: k }) => kind === k)
  }, [selectableAccounts])

  const capital = useMemo(() => accountsFor("capital"), [accountsFor])
  const savings = useMemo(() => accountsFor("savings"), [accountsFor])
  const debt = useMemo(() => accountsFor("debt"), [accountsFor])
  const credit = useMemo(() => accountsFor("credit"), [accountsFor])

  const onClick = (id: number) => onSelected(id)

  return (
    <div className="space-y-2 flex-grow overflow-y-auto">
      {
        capital.length > 0 && (
          <>
            <p className="text-xl mb-2">Capital</p>
            {
              capital.map((account) => (
                <PreviewAccount
                  key={`target.account.transfer.${account.id}`}
                  account={account}
                  onClick={() => onClick(account.id)}
                />
              ))
            }
          </>
        )
      }
      {
        savings.length > 0 && (
          <>
            <p className="text-xl mb-2">Savings</p>
            {
              savings.map((account) => (
                <PreviewAccount
                  key={`target.account.transfer.${account.id}`}
                  account={account}
                  onClick={() => onClick(account.id)}
                />
              ))
            }
          </>
        )
      }
      {
        debt.length > 0 && (
          <>
            <p className="text-xl mb-2">Debts</p>
            {
              debt.map((account) => (
                <PreviewAccount
                  key={`target.account.transfer.${account.id}`}
                  account={account}
                  onClick={() => onClick(account.id)}
                />
              ))
            }
          </>
        )
      }
      {
        credit.length > 0 && (
          <>
            <p className="text-xl mb-2">Credit</p>
            {
              credit.map((account) => (
                <PreviewAccount
                  key={`target.account.transfer.${account.id}`}
                  account={account}
                  onClick={() => onClick(account.id)}
                />
              ))
            }
          </>
        )
      }
      {
        capital.length > 0 && (
          <>
            <p className="text-xl mb-2">Capital</p>
            {
              capital.map((account) => (
                <PreviewAccount
                  key={`target.account.transfer.${account.id}`}
                  account={account}
                  onClick={() => onClick(account.id)}
                />
              ))
            }
          </>
        )
      }
      {
        savings.length > 0 && (
          <>
            <p className="text-xl mb-2">Savings</p>
            {
              savings.map((account) => (
                <PreviewAccount
                  key={`target.account.transfer.${account.id}`}
                  account={account}
                  onClick={() => onClick(account.id)}
                />
              ))
            }
          </>
        )
      }
      {
        debt.length > 0 && (
          <>
            <p className="text-xl mb-2">Debts</p>
            {
              debt.map((account) => (
                <PreviewAccount
                  key={`target.account.transfer.${account.id}`}
                  account={account}
                  onClick={() => onClick(account.id)}
                />
              ))
            }
          </>
        )
      }
      {
        credit.length > 0 && (
          <>
            <p className="text-xl mb-2">Credit</p>
            {
              credit.map((account) => (
                <PreviewAccount
                  key={`target.account.transfer.${account.id}`}
                  account={account}
                  onClick={() => onClick(account.id)}
                />
              ))
            }
          </>
        )
      }
      {
        capital.length > 0 && (
          <>
            <p className="text-xl mb-2">Capital</p>
            {
              capital.map((account) => (
                <PreviewAccount
                  key={`target.account.transfer.${account.id}`}
                  account={account}
                  onClick={() => onClick(account.id)}
                />
              ))
            }
          </>
        )
      }
      {
        savings.length > 0 && (
          <>
            <p className="text-xl mb-2">Savings</p>
            {
              savings.map((account) => (
                <PreviewAccount
                  key={`target.account.transfer.${account.id}`}
                  account={account}
                  onClick={() => onClick(account.id)}
                />
              ))
            }
          </>
        )
      }
      {
        debt.length > 0 && (
          <>
            <p className="text-xl mb-2">Debts</p>
            {
              debt.map((account) => (
                <PreviewAccount
                  key={`target.account.transfer.${account.id}`}
                  account={account}
                  onClick={() => onClick(account.id)}
                />
              ))
            }
          </>
        )
      }
      {
        credit.length > 0 && (
          <>
            <p className="text-xl mb-2">Credit</p>
            {
              credit.map((account) => (
                <PreviewAccount
                  key={`target.account.transfer.${account.id}`}
                  account={account}
                  onClick={() => onClick(account.id)}
                />
              ))
            }
          </>
        )
      }
    </div>
  )
}
