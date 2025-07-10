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

export type UpdateAction = (values: OldUpdate, success: () => void, failure: () => void) => Promise<void>
export type OnSubmitUpdateAction = (values: OldUpdate) => Promise<void>

export type UpdateChildAction = (values: UpdateChild, success: () => void, failure: () => void) => Promise<void>
export type OnSubmitUpdateChildAction = (values: UpdateChild) => Promise<void>
