import { use } from "react";
import { FiltersContext } from "../contexts/filters-context";

export function useFilters() {
  return use(FiltersContext)
}