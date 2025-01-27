import { Kinds } from "~/modules/shared/types/account";
import { Currency } from "~/modules/shared/types/currency";
import { Icon } from "~/modules/shared/types/icon";

type ModuleKind =
  Kinds["capital_normal"] |
  Kinds["capital_savings"] |
  Kinds["debt_credit"] |
  Kinds["debt_loan"] |
  Kinds["debt_personal"]

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
