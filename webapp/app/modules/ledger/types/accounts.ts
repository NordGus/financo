import { Kind } from "~/modules/shared/types/account"
import { SystemCurrency } from "~/modules/shared/types/currency"
import { Icon } from "~/modules/shared/types/icon"

export { isAccount, isArchived, isCategory, isDebt }
export type { Account, Accounts }

type Accounts = Map<number, Account>

type Account = {
  id: number
  parentId: number | null
  kind: Kind
  currency: SystemCurrency
  name: string
  description?: string | null
  color: string
  icon: Icon
  capital: number
  balance: number
  main: boolean
  archivedAt: string | null
  deletedAt: string | null
  createdAt: string
  updatedAt: string
}

function isAccount({ kind }: Account): boolean {
  switch (kind) {
    case "capital":
    case "savings":
    case "debt":
    case "credit":
      return true
    default:
      return false
  }
}

function isCategory({ kind }: Account): boolean {
  switch (kind) {
    case "income":
    case "expense":
      return true
    default:
      return false
  }
}

function isDebt({ kind }: Account): boolean {
  switch (kind) {
    case "debt":
    case "credit":
      return true
    default:
      return false
  }
}

function isArchived({ archivedAt, deletedAt }: Account): boolean {
  return !!archivedAt || !!deletedAt
}
