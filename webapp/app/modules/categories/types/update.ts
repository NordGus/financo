import { Currency } from "~/shared/types/currency";
import { Icon } from "~/shared/types/icon";
import { ModuleKind } from "./account";

type UpdateChild = {
  id: number
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
  children: UpdateChild[]
}

export type Updated = {
  id: number
  name: string
  kind: ModuleKind
  color: string
  icon: Icon
}
