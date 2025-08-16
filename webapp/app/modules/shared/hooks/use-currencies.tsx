import { use } from "react";
import { CurrenciesContext } from "../contexts/currencies-context";

export function useCurrencies() {
  return use(CurrenciesContext)
}