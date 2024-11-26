import { Kind } from "~/shared/types/account"
import { Currency } from "~/shared/types/currency"

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
  icon: string
  color: string
  capital: number
  additionalData: AdditionalData
  archivedAt?: string | null
  deletedAt?: string | null
  createdAt: string
  updatedAt: string
}

export type { Account }
