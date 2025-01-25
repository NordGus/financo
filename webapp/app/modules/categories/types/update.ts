import { Currency } from "~/shared/types/currency";
import { Icon } from "~/shared/types/icon";
import { Child, ModuleKind } from "./category";

export type UpdateChild = {
  id: number
  parentId: number
  name: string
  description?: string | null
  icon: Icon
}

export type Update = {
  id: number
  name: string
  description?: string | null
  currency: Currency
  color: string,
  icon: Icon,
}

export type Updated = {
  id: number
  name: string
  kind: ModuleKind
  color: string
  icon: Icon
}

export type ChildUpdated = Child
