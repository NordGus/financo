import { createContext, PropsWithChildren, useCallback } from "react"
import { useSearchParams } from "react-router"
import { Filters, updateURLSearchParams } from "../types/filters"

/**
 * SetFilters is a function type that takes a Filters object or a function that returns a Filters object.
 * It is used to update the filters in the ledger application.
 */
type SetFilters = (nextFilters: Filters | ((prev: Filters) => Filters)) => void

type FiltersContextState = {
  filters: Filters
  setFilters: SetFilters
}

export const FiltersContext = createContext<FiltersContextState>({
  filters: {
    period: "unlimited",
    accounts: [],
    categories: []
  },
  setFilters: () => { }
})

type Props = {
  filters: Filters
}

export function FiltersContextProvider({ filters, children }: PropsWithChildren<Props>) {
  const [, setSearchParams] = useSearchParams()

  const setFilters = useCallback<SetFilters>((nextFilters) => {
    setSearchParams((prev) =>
      updateURLSearchParams(
        prev,
        typeof nextFilters === "function" ? nextFilters(filters) : nextFilters
      )
    )
  }, [setSearchParams, filters])

  return (
    <FiltersContext.Provider value={{ filters, setFilters }} >
      {children}
    </FiltersContext.Provider>
  )
}