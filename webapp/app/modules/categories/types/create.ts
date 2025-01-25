import { Currency } from "~/shared/types/currency";
import { Icon } from "~/shared/types/icon";
import { Child, ModuleKind } from "./category";

export type CreateChild = {
  name: string
  description?: string | null
  icon: Icon
}

export type Create = {
  kind: ModuleKind
  name: string
  description?: string | null
  currency: Currency
  color: string,
  icon: Icon,
  children: CreateChild[]
}

export type Created = {
  id: number
  name: string
  kind: ModuleKind
  color: string
  icon: Icon
}

export type CreateAction = (data: Create, success: () => void, failure: () => void) => Promise<void>
export type OnSubmitCreateAction = (data: Create) => Promise<void>

export type CreateChildAction =
  (parentId: number, data: CreateChild, success: (child: Child) => void, failure: () => void) => Promise<void>
export type OnSubmitCreateChildAction =
  (parentId: number, data: CreateChild) => Promise<void>
