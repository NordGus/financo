import { Currency } from "~/modules/shared/types/currency";
import { Icon } from "~/modules/shared/types/icon";
import { Kind } from "./accounts";

export type Create = {
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

export type CreateAccountAction = (values: Create, success: () => void, failure: () => void) => Promise<void>
export type OnSubmitCreateAccountAction = (values: Create) => Promise<void>