import { SavingsGoal } from "../../shared/types/savings-goals";

export type { Milestone, MilestoneGroup };

type Milestone = SavingsGoal

type MilestoneGroup = {
  timestamp: string
  achievements: Milestone[]
}