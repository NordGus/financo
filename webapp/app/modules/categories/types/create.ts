import { Currency } from "~/shared/types/currency";
import { Icon } from "~/shared/types/icon";
import { ModuleKind } from "./category";

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