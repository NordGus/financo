import { create as createStore } from "zustand";
import { list } from "../api/queries/list-currencies";
import { Entry } from "../types/currency";

interface CurrenciesState {
  currencies: Entry[]

  list: () => Promise<void>
}

const useCurrenciesStore = createStore<CurrenciesState>((set) => ({
  currencies: [],
  list: async () => {
    const entries = await list()

    set({ currencies: entries })
  },
}))

export { useCurrenciesStore };
