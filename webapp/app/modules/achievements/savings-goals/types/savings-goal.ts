import { Currency } from "~/modules/shared/types/currency"

export type { SavingsGoal, SavingsGoalsGroup }

type SavingsGoal = {
  id: number
  name: string
  description: string | null | undefined
  position: number
  target: number
  saved: number
  currency: Currency
  createdAt: string
  updatedAt: string
}

type SavingsGoalsGroup = {
  currency: Currency
  goals: SavingsGoal[]
}