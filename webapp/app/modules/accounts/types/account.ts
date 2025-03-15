import { Kinds } from "~/modules/shared/types/account";
import { Currency } from "~/modules/shared/types/currency";
import { Icon } from "~/modules/shared/types/icon";

type ModuleKind =
  Kinds["capital"] |
  Kinds["savings"] |
  Kinds["credit"] |
  Kinds["debt"]

interface History {
  at?: string | null
  balance?: number | null
}

interface AdditionalData {
  main: boolean
  balance: number
  history: History
  transactions: number
}

interface Account {
  id: number
  kind: ModuleKind
  currency: Currency
  name: string
  description?: string | null
  icon: Icon
  color: string
  capital: number
  additionalData: AdditionalData
  archivedAt?: string | null
  deletedAt?: string | null
  createdAt: string
  updatedAt: string
}

export type { Account, ModuleKind };
