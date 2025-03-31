import { useMemo } from "react";
import { useLoaderData, useSearchParams } from "react-router";
import { clientLoader } from "~/routes/ledger";
import { Filters, updateURLSearchParams } from "../types/filters";

type SetFiltersDispatch = (filters: Filters) => void

type UseFiltersHookValue = {
  filters: Filters;
  setFilters: SetFiltersDispatch;
}

/**
 * useFilters is a custom hook that provides access to the current filters and
 * a way to updated them.
 *
 * @returns {UseFiltersHookValue} - The filters and a dispatch function to update them.
 */
export function useFilters(): UseFiltersHookValue {
  const { filters } = useLoaderData<typeof clientLoader>()
  const [, setSearchParams] = useSearchParams()

  const values = useMemo<UseFiltersHookValue>(() => {
    return {
      filters,
      setFilters: (filters) => setSearchParams((prev) => updateURLSearchParams(prev, filters)),
    }
  }, [filters, setSearchParams])

  return values
}