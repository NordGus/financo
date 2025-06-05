import { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import { createSearchParams, useSearchParams } from "react-router";
import { defaultListFilters, ListFilters, listFiltersToURLSearchParams } from "../types/filters";

type SetListFilters = (nextFilters: ListFilters | ((prev: ListFilters) => ListFilters)) => void

type ListFiltersContextState = {
  filters: ListFilters
  setFilters: SetListFilters
}

export const ListFiltersContext = createContext<ListFiltersContextState>({
  filters: defaultListFilters(),
  setFilters: () => { }
})

type Props = {
  filters: ListFilters
}

export function ListFiltersContextProvider({ filters, children }: PropsWithChildren<Props>) {
  const [, setSearchParams] = useSearchParams()
  const [currentFilters, setCurrentFilters] = useState<ListFilters>(filters)

  const setFilters = useCallback<SetListFilters>((nextFilters) => {
    setSearchParams(
      createSearchParams(
        listFiltersToURLSearchParams(
          typeof nextFilters === "function" ? nextFilters(currentFilters) : nextFilters
        )
      )
    )
  }, [currentFilters, setSearchParams])

  const value = useMemo<ListFiltersContextState>(() => ({
    filters: currentFilters,
    setFilters
  }), [currentFilters, setFilters])

  useEffect(() => {
    setCurrentFilters(filters)
  }, [
    filters.kinds.sort().join(","),
    filters.kind,
    filters.archived,
    filters.currencies.sort().join(",")
  ])

  return (
    <ListFiltersContext.Provider value={value}>
      {children}
    </ListFiltersContext.Provider>
  )
}