import { create as createStore } from "zustand";
import { Entry } from "~/modules/currencies/type/entry";
import { list } from "../api/queries/list";

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
