import { createContext, PropsWithChildren } from "react"
import { Account, Accounts } from "../types/accounts"

type AccountsContextState = {
  accounts: Account[]
  accountsMap: Accounts
}

export const AccountsContext = createContext<AccountsContextState>({
  accounts: [],
  accountsMap: new Map()
})

type Props = {
  accounts: Account[]
  accountsMap: Accounts
}

export function AccountsContextProvider({ accounts, accountsMap, children }: PropsWithChildren<Props>) {
  return (
    <AccountsContext.Provider value={{ accounts, accountsMap }}>
      {children}
    </AccountsContext.Provider>
  )
}