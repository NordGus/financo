import { Achievement } from "~/modules/shared/types/achievement"
import { Currency } from "~/modules/shared/types/currency"

export type { SavingsGoal }

type Settings = {
  position: number
  target: number
  saved: number
  currency: Currency
}

type SavingsGoal = Achievement<"savings_goal", Settings>