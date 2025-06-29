import { create as createStore } from "zustand";
import { archive } from "../api/commands/archive";
import { archiveChild } from "../api/commands/archive-child";
import { create } from "../api/commands/create";
import { createChild } from "../api/commands/create-child";
import { destroy } from "../api/commands/destroy";
import { destroyChild } from "../api/commands/destroy-child";
import { unarchive } from "../api/commands/unarchive";
import { unarchiveChild } from "../api/commands/unarchive-child";
import { update } from "../api/commands/update";
import { updateChild } from "../api/commands/update-child";
import { list } from "../api/queries/list";
import { Category, Child as ChildCategory } from "../types/category";
import { Create, CreateChild } from "../types/create";
import { Update, UpdateChild } from "../types/update";

interface CategoriesState {
  categories: Category[]

  list: () => void

  create: (data: Create) => Promise<Category>
  update: (data: Update) => Promise<Category>
  archive: (id: number) => Promise<Category>
  unarchive: (id: number) => Promise<Category>
  destroy: (id: number) => Promise<Category>

  createChild: (parentId: number, data: CreateChild) => Promise<ChildCategory>
  updateChild: (data: UpdateChild) => Promise<ChildCategory>
  archiveChild: (parentId: number, id: number) => Promise<ChildCategory>
  unarchiveChild: (parentId: number, id: number) => Promise<ChildCategory>
  destroyChild: (parentId: number, id: number) => Promise<ChildCategory>
}

const useCategoriesStore = createStore<CategoriesState>((set) => ({
  categories: [],
  list: async () => {
    const categories = await list({ kinds: [] })

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
      categories: [...state.categories.map((category) => category.id === id ? destroyed : category)]
    }))

    return destroyed
  },
  createChild: async (parentId, data) => {
    const created = await createChild(parentId, data)

    set((state) => ({
      ...state,
      categories: [
        ...state.categories.map((category) => {
          if (category.id !== parentId) return category

          return {
            ...category,
            children: [...category.children, created]
          }
        })]
    }))

    return created
  },
  updateChild: async (data) => {
    const updated = await updateChild(data)

    set((state) => ({
      ...state,
      categories: [
        ...state.categories.map((category) => {
          if (category.id !== data.parentId) return category

          return {
            ...category,
            children: [...category.children.map((child) => child.id === updated.id ? updated : child)]
          }
        })]
    }))

    return updated
  },
  archiveChild: async (parentId, id) => {
    const archived = await archiveChild(parentId, id)

    set((state) => ({
      ...state,
      categories: [
        ...state.categories.map((category) => {
          if (category.id !== parentId) return category

          return {
            ...category,
            children: [...category.children.map((child) => child.id === archived.id ? archived : child)]
          }
        })]
    }))

    return archived
  },
  unarchiveChild: async (parentId, id) => {
    const unarchived = await unarchiveChild(parentId, id)

    set((state) => ({
      ...state,
      categories: [
        ...state.categories.map((category) => {
          if (category.id !== parentId) return category

          return {
            ...category,
            children: [...category.children.map((child) => child.id === unarchived.id ? unarchived : child)]
          }
        })]
    }))

    return unarchived
  },
  destroyChild: async (parentId, id) => {
    const deleted = await destroyChild(parentId, id)

    set((state) => ({
      ...state,
      categories: [
        ...state.categories.map((category) => {
          if (category.id !== parentId) return category

          return {
            ...category,
            children: [...category.children.map((child) => child.id === deleted.id ? deleted : child)]
          }
        })]
    }))

    return deleted
  },
}))

export { useCategoriesStore };
