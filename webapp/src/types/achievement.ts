type Settings = Record<string, unknown>

enum Kind {
    SavingsGoal = "savings_goal"
}

interface Achievement<Settings> {
    id: number
    name: string
    kind: Kind,
    description: string | null
    settings: Settings
    achievedAt: string | null
    archivedAt: string | null
    createdAt: string
    updatedAt: string
}

interface Milestone {
    timestamp: string
    achievements: Achievement<Settings>[]
}

export { Kind }
export type { Achievement, Milestone, Settings }

