import { create as createStore } from "zustand";
import { archive } from "../api/commands/archive";
import { create } from "../api/commands/create";
import { destroy } from "../api/commands/destroy";
import { unarchive } from "../api/commands/unarchive";
import { update } from "../api/commands/update";
import { list } from "../api/queries/list";
import { Category } from "../types/category";
import { Create } from "../types/create";
import { Update } from "../types/update";

interface CategoryState {
  categories: Category[]
  list: () => void
  create: (data: Create) => Promise<Category>
  update: (data: Update) => Promise<Category>
  archive: (id: number) => Promise<Category>
  unarchive: (id: number) => Promise<Category>
  destroy: (id: number) => Promise<Category>
}

const useCategoriesStore = createStore<CategoryState>((set) => ({
  categories: [],
  list: async () => {
    const categories = await list()

    set({ categories })
  },
  create: async (data) => {
    const created = await create(data)

    set((state) => ({
      ...state,
      categories: [
        ...state.categories,
        created,
      ]
    }))

    return created
  },
  update: async (data) => {
    const updated = await update(data)

    set((state) => ({
      ...state,
      categories: [...state.categories.map((category) => category.id === updated.id ? updated : category)]
    }))

    return updated
  },
  archive: async (id) => {
    const archived = await archive(id)

    set((state) => ({
      ...state,
      categories: [...state.categories.map((category) => category.id === archived.id ? archived : category)]
    }))

    return archived
  },
  unarchive: async (id) => {
    const unarchived = await unarchive(id)

    set((state) => ({
      ...state,
      categories: [...state.categories.map((category) => category.id === unarchived.id ? unarchived : category)]
    }))

    return unarchived
  },
  destroy: async (id) => {
    const destroyed = await destroy(id)

    set((state) => ({
      ...state,
      categories: [...state.categories.filter((category) => category.id !== destroyed.id)]
    }))

    return destroyed
  },
}))

export { useCategoriesStore };
