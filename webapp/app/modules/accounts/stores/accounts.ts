import { create as createStore } from "zustand";
import { archive } from "../api/commands/archive";
import { create } from "../api/commands/create";
import { destroy } from "../api/commands/destroy";
import { unarchive } from "../api/commands/unarchive";
import { update } from "../api/commands/update";
import { list } from "../api/queries/list";
import { Account } from "../types/accounts";
import { Create } from "../types/create";
import { Update } from "../types/update";

interface AccountsState {
  accounts: Account[]

  list: () => void

  create: (data: Create) => Promise<Account>
  update: (data: Update) => Promise<Account>
  archive: (id: number) => Promise<Account>
  unarchive: (id: number) => Promise<Account>
  destroy: (id: number) => Promise<Account>
}

const useAccountsStore = createStore<AccountsState>((set) => ({
  accounts: [],
  list: async () => {
    const accounts = await list()

    set({ accounts })
  },
  create: async (data) => {
    const created = await create(data)

    set((state) => ({
      ...state,
      accounts: [...state.accounts, created]
    }))

    return created
  },
  update: async (data) => {
    const updated = await update(data)

    set((state) => ({
      ...state,
      accounts: [...state.accounts.map((account) => account.id === updated.id ? updated : account)]
    }))

    return updated
  },
  archive: async (id) => {
    const archived = await archive(id)

    set((state) => ({
      ...state,
      accounts: [...state.accounts.map((account) => account.id === archived.id ? archived : account)]
    }))

    return archived
  },
  unarchive: async (id) => {
    const unarchived = await unarchive(id)

    set((state) => ({
      ...state,
      accounts: [...state.accounts.map((account) => account.id === unarchived.id ? unarchived : account)]
    }))

    return unarchived
  },
  destroy: async (id) => {
    const deleted = await destroy(id)

    set((state) => ({
      ...state,
      accounts: [...state.accounts.map((account) => account.id === deleted.id ? deleted : account)]
    }))

    return deleted
  },
}))

export { useAccountsStore };
