import { createContext, PropsWithChildren } from "react"
import { Entry } from "../types/currency"

type CurrenciesContextState = {
  currencies: Entry[]
}

export const CurrenciesContext = createContext<CurrenciesContextState>({
  currencies: []
})

type Props = {
  currencies: Entry[]
}

export function CurrenciesContextProvider({ currencies, children }: PropsWithChildren<Props>) {
  return (
    <CurrenciesContext.Provider value={{ currencies }}>
      {children}
    </CurrenciesContext.Provider>
  )
}