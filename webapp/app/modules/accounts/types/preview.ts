import { Kind } from "~/shared/types/account"
import { Currency } from "~/shared/types/currency"

interface Settings {
  favorite: boolean
  balance: number
  historyBalance?: number | null
  historyAt?: string | null
  transactionCount: number
}

interface Account {
  id: number
  kind: Kind
  currency: Currency
  name: string
  description?: string | null
  icon: string
  color: string
  capital: number
  settings: Settings
  archivedAt?: string | null
  deletedAt?: string | null
  createdAt: string
  updatedAt: string
}

export type { Account }
