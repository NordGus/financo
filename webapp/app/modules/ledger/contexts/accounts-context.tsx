import { createContext, PropsWithChildren } from "react"
import { Account, AccountChildren, Accounts } from "../types/accounts"

type AccountsContextState = {
  accounts: Account[]
  accountsMap: Accounts
  accountsChildren: AccountChildren
}

export const AccountsContext = createContext<AccountsContextState>({
  accounts: [],
  accountsMap: new Map(),
  accountsChildren: new Map()
})

type Props = {
  accounts: Account[]
  accountsMap: Accounts
  accountsChildren: AccountChildren
}

export function AccountsContextProvider({
  accounts, accountsMap, accountsChildren, children
}: PropsWithChildren<Props>) {
  return (
    <AccountsContext.Provider value={{ accounts, accountsMap, accountsChildren }}>
      {children}
    </AccountsContext.Provider>
  )
}