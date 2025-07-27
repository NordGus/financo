import { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import { createSearchParams, useSearchParams } from "react-router";
import { defaultFilters, Filters, filtersToURLSearchParams } from "../types/filters";

type SetFilters = (nextFilters: Filters | ((prev: Filters) => Filters)) => void

type FiltersContextState = {
  filters: Filters
  setFilters: SetFilters
}

export const FiltersContext = createContext<FiltersContextState>({
  filters: defaultFilters(),
  setFilters: () => { }
})

type Props = {
  filters: Filters
}

export function FiltersContextProvider({ filters, children }: PropsWithChildren<Props>) {
  const [, setSearchParams] = useSearchParams()
  const [currentFilters, setCurrentFilters] = useState<Filters>(filters)

  const setFilters = useCallback<SetFilters>((nextFilters) => {
    setSearchParams(
      createSearchParams(
        filtersToURLSearchParams(
          typeof nextFilters === "function" ? nextFilters(currentFilters) : nextFilters
        )
      )
    )
  }, [currentFilters, setSearchParams])

  const value = useMemo<FiltersContextState>(() => ({
    filters: currentFilters,
    setFilters
  }), [currentFilters, setFilters])

  useEffect(() => {
    setCurrentFilters(filters)
  }, [
    filters.from?.toDateString(),
    filters.to?.toDateString(),
    filters.period,
    filters.kinds.sort().join(",")
  ])

  return (
    <FiltersContext.Provider value={value}>
      {children}
    </FiltersContext.Provider>
  )
}