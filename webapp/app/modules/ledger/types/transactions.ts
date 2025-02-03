export type Transaction = {
  id: number
  sourceId: number
  targetId: number
  sourceAmount: number
  targetAmount: number
  notes: string | null
  issuedAt: string
  executedAt: string | null
  deletedAt: string | null
  createdAt: string
  updatedAt: string
}

export type Filters = {
  from?: Date
  to?: Date
  accounts?: number[]
  categories?: number[]
}

export type Period = "unlimited" | "daily" | "weekly" | "monthly" | "yearly" | "custom"

export type Transactions = [string, Transaction[]][]

export type SearchAction = (
  filter: Filters,
  abort: AbortSignal,
  success: () => void,
  failure: () => void
) => Promise<void>
