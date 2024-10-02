import { Currency } from "dinero.js"

export interface Goal {
    id: number
    name: string
    description: string | null
    goal: number
    currency: Currency
    balance: number
    position: number
    achievedAt: string | null
    archivedAt: string | null
    createdAt: string
    updatedAt: string
}