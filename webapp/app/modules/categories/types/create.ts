import { Kind } from "~/shared/types/account";
import { Currency } from "~/shared/types/currency";
import { Icon } from "~/shared/types/icon";

interface CreateChild {
  name: string
  description?: string | null
  icon: Icon
}

export interface Create {
  kind: Kind
  name: string
  description?: string | null
  currency: Currency
  color: string,
  icon: Icon,
  children: CreateChild[]
}

export interface Created {
  id: number
  name: string
  kind: Kind
  color: string
  icon: Icon
}