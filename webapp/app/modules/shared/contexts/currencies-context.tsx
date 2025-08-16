import { createContext, PropsWithChildren, useMemo } from "react"
import { Currency, Entry } from "../types/currency"

type CurrenciesContextState = {
  currencies: Entry[]
  currenciesMap: Map<Currency, Entry>
}

export const CurrenciesContext = createContext<CurrenciesContextState>({
  currencies: [],
  currenciesMap: new Map<Currency, Entry>()
})

type Props = {
  currencies: Entry[]
}

export function CurrenciesContextProvider({ currencies, children }: PropsWithChildren<Props>) {
  const currenciesMap = useMemo<Map<Currency, Entry>>(() => {
    return new Map(currencies.map(entry => ([entry.code, entry])))
  }, [currencies.map(({ code }) => code).sort().join(",")])

  return (
    <CurrenciesContext.Provider value={{ currencies, currenciesMap }}>
      {children}
    </CurrenciesContext.Provider>
  )
}