import { Currency } from "~/modules/shared/types/currency";
import { Icon } from "~/modules/shared/types/icon";

export type UpdateChild = {
  id: number
  parentId: number
  name: string
  description?: string | null
  icon: Icon
}

export type Update = {
  id: number
  name: string
  description?: string | null
  currency: Currency
  color: string,
  icon: Icon,
}

export type UpdateAction = (values: Update, success: () => void, failure: () => void) => Promise<void>
export type OnSubmitUpdateAction = (values: Update) => Promise<void>

export type UpdateChildAction = (values: UpdateChild, success: () => void, failure: () => void) => Promise<void>
export type OnSubmitUpdateChildAction = (values: UpdateChild) => Promise<void>
