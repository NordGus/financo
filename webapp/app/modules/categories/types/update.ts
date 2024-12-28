import { Kind } from "~/shared/types/account";
import { Currency } from "~/shared/types/currency";
import { Icon } from "~/shared/types/icon";

interface UpdateChild {
  id: number
  name: string
  description?: string | null
  icon: Icon
}

export interface Update {
  id: number
  name: string
  description?: string | null
  currency: Currency
  color: string,
  icon: Icon,
  children: UpdateChild[]
}

export interface Updated {
  id: number
  name: string
  kind: Kind
  color: string
  icon: Icon
}