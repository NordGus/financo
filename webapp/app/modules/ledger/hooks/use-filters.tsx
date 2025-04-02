import { useCallback } from "react";
import { useLoaderData, useSearchParams } from "react-router";
import { clientLoader } from "~/routes/ledger";
import { Filters, updateURLSearchParams } from "../types/filters";

type SetFilters = (nextFilters: Filters | ((prev: Filters) => Filters)) => void

/**
 * Returns a tuple of the current screen's {@link Filters} and a function to
 * update them. Setting the filters causes a navigation.
 *
 * ```tsx
 *  export default function Component() {
 *    const [filters, setFilters] = useFilters()
 *    // ...
 *  }
 * ```
 *
 * @returns [{@link Filters}, {@link SetFilters}] - The filters and a dispatch function to update them.
 * @category Hooks
 */
export function useFilters(): [Filters, SetFilters] {
  const { filters } = useLoaderData<typeof clientLoader>()
  const [, setSearchParams] = useSearchParams()

  const setFilters = useCallback<SetFilters>((nextFilters) => {
    setSearchParams((prev) =>
      updateURLSearchParams(
        prev,
        typeof nextFilters === "function"
          ? nextFilters(filters)
          : nextFilters
      )
    )
  }, [setSearchParams])

  return [filters, setFilters]
}