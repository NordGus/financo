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

type Create = {
  kind: Kind
  name: string
  description?: string | null
  currency: Currency
  capital: number
  color: string,
  icon: Icon,
  main: boolean,
  history: {
    at?: string | null,
    balance?: number | null
  }
}

type Update = {
  id: number
  name: string
  description?: string | null
  currency: Currency
  capital: number
  color: string,
  icon: Icon,
  main: boolean,
  history: {
    at?: string | null,
    balance?: number | null
  }
}

export type { Account, Create, Kind, Update };

