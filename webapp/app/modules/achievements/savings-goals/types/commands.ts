import { Currency } from "~/modules/shared/types/currency"

export type { Create, Reorder }

type Reorder = {
  id: number
  from: number
  to: number
}

type Create = {
  name: string
  description: string | null | undefined
  target: number
  currency: Currency
}