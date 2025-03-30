import { Kind } from "~/modules/shared/types/account"
import { SystemCurrency } from "~/modules/shared/types/currency"
import { Icon } from "~/modules/shared/types/icon"

export type Accounts = Map<number, Account>

export type Account = {
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