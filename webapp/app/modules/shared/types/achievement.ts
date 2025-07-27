export { KINDS }
export type { Achievement, Kind, Kinds }

const KINDS = {
  savings_goal: "savings_goal"
} as const

type Kinds = typeof KINDS

type Kind = Kinds["savings_goal"]

type Achievement<K extends keyof Kinds = keyof Kinds, Settings = Record<string, unknown>> = {
  id: number
  kind: K
  name: string
  description: string | null | undefined
  settings: Settings
  achieveAt: string | null | undefined
  deletedAt: string | null | undefined
  createdAt: string
  updatedAt: string
}
