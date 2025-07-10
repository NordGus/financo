import { Icon } from "~/modules/shared/types/icon";

export type UpdateChild = {
  id: number
  parentId: number
  name: string
  description?: string | null
  icon: Icon
}

export type OldUpdate = {
  id: number
  name: string
  description?: string | null
  color: string,
  icon: Icon,
}

export type UpdateSubcategory = {
  id: number
  icon: Icon
  name: string
  description: string | null | undefined
  intent: "update" | "archive" | "unarchive" | "destroy"
}

export type CreateSubcategory = {
  id?: null
  icon: Icon
  name: string
  description: string | null | undefined
  intent: "create"
}

export type Update = {
  id: number
  name: string
  description: string | null | undefined
  color: string
  icon: Icon
  subcategories: Array<UpdateSubcategory | CreateSubcategory>
}

export type UpdateAction = (values: OldUpdate, success: () => void, failure: () => void) => Promise<void>
export type OnSubmitUpdateAction = (values: OldUpdate) => Promise<void>

export type UpdateChildAction = (values: UpdateChild, success: () => void, failure: () => void) => Promise<void>
export type OnSubmitUpdateChildAction = (values: UpdateChild) => Promise<void>
