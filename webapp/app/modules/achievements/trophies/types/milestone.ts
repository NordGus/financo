import { SavingsGoal } from "../../shared/types/savings-goals";

export type { Milestone };

type Milestone = {
  timestamp: string
  achievements: SavingsGoal[]
}