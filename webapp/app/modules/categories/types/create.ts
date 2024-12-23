import { Kind } from "~/shared/types/account";
import { Currency } from "~/shared/types/currency";
import { Icon } from "~/shared/types/icon";

export interface Create {
  kind: Kind
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

export interface Created {
  id: number
  name: string
  kind: Kind
  color: string
  icon: Icon
}