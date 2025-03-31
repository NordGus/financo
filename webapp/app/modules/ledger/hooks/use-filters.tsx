import { useMemo } from "react";
import { useLoaderData, useSearchParams } from "react-router";
import { clientLoader } from "~/routes/ledger";
import { Filters, updateURLSearchParams } from "../types/filters";

type SetFiltersDispatch = (filters: Filters) => void

type UseFiltersHookValue = {
  filters: Filters;
  setFilters: SetFiltersDispatch;
}

export function useFilters(): UseFiltersHookValue {
  const { filters } = useLoaderData<typeof clientLoader>()
  const [, setSearchParams] = useSearchParams()

  console.log(filters)


  const values = useMemo<UseFiltersHookValue>(() => {
    return {
      filters,
      setFilters: (filters) => setSearchParams((prev) => updateURLSearchParams(prev, filters)),
    }
  }, [
    filters,
    filters.accounts.length,
    filters.categories.length,
    filters.from?.toISOString(),
    filters.to?.toISOString(),
    filters.period,
    setSearchParams
  ])

  return values
}