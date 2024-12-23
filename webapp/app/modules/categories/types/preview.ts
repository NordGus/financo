import { Kind, Kinds } from "~/shared/types/account";
import { Currency } from "~/shared/types/currency";
import { Icon } from "~/shared/types/icon";

interface Child {
  id: number
  kind: Kinds["external_expense"] | Kinds["external_income"]
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

interface Account {
  id: number
  kind: Kind
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

export type { Account };
