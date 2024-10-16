type Settings = Record<string, unknown>

enum Kind {
    SavingsGoal = "savings_goal"
}

interface Achievable<Settings> {
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

export { Kind }
export type { Achievable, Settings }

