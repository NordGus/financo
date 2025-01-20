import { Currency } from "~/shared/types/currency";
import { Icon } from "~/shared/types/icon";
import { ModuleKind } from "./account";

type Child = {
  id: number
  kind: ModuleKind
  currency: Currency
  name: string
  description?: string | null
  icon: Icon
  color: string
  archivedAt?: string | null
  deletedAt?: string | null
  createdAt: string
  updatedAt: string
  transactions: number
}

type Account = {
  id: number
  kind: ModuleKind
  currency: Currency
  name: string
  description?: string | null
  icon: Icon
  color: string
  archivedAt?: string | null
  deletedAt?: string | null
  createdAt: string
  updatedAt: string
  transactions: number
  children: Child[]
}

export type { Account, Child };
