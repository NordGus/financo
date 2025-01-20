import { Currency } from "~/shared/types/currency";
import { Icon } from "~/shared/types/icon";
import { ModuleKind } from "./account";

export type Update = {
  id: number
  name: string
  description?: string | null
  currency: Currency
  capital: number
  color: string,
  icon: Icon,
  history: {
    at?: string | null,
    balance?: number | null
  }
}

export type Updated = {
  id: number
  name: string
  kind: ModuleKind
  color: string
  icon: Icon
}