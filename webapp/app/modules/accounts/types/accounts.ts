import { Kinds as SystemKinds } from "~/modules/shared/types/account";
import { Currency } from "~/modules/shared/types/currency";
import { Icon } from "~/modules/shared/types/icon";

type Kind =
  SystemKinds["capital"] |
  SystemKinds["savings"] |
  SystemKinds["credit"] |
  SystemKinds["debt"]

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
  kind: Kind
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

export type { Account, Kind };
