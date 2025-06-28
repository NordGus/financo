import { Icon } from "~/modules/shared/types/icon";
import { Kind } from "./category";

export type CreateChild = {
  name: string
  description?: string | null
  icon: Icon
}

export type Create = {
  kind: Kind
  name: string
  description?: string | null
  color: string,
  icon: Icon,
  children: CreateChild[]
}

export type Created = {
  id: number
  name: string
  kind: Kind
  color: string
  icon: Icon
}

export type CreateAction = (data: Create, success: () => void, failure: () => void) => Promise<void>
export type OnSubmitCreateAction = (data: Create) => Promise<void>

export type CreateChildAction =
  (parentId: number, data: CreateChild, success: () => void, failure: () => void) => Promise<void>
export type OnSubmitCreateChildAction =
  (parentId: number, data: CreateChild) => Promise<void>
