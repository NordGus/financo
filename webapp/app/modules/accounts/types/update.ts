import { Currency } from "~/modules/shared/types/currency";
import { Icon } from "~/modules/shared/types/icon";

export type Update = {
  id: number
  name: string
  description?: string | null
  currency: Currency
  capital: number
  color: string,
  icon: Icon,
  history: {
    at?: string | null,
    balance?: number | null
  }
}

export type UpdateAccountAction = (values: Update, success: () => void, failure: () => void) => Promise<void>
export type OnSubmitUpdateAccountAction = (values: Update) => Promise<void>