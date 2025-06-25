import { Kinds as SystemKinds } from "~/modules/shared/types/account";
import { Currency } from "~/modules/shared/types/currency";
import { Icon } from "~/modules/shared/types/icon";

const NAME_MIN_LENGTH = 3
const NAME_MAX_LENGTH = 250
const DESCRIPTION_MAX_LENGTH = 1000

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

export { DESCRIPTION_MAX_LENGTH, NAME_MAX_LENGTH, NAME_MIN_LENGTH };
export type { Account, Create, Kind };

