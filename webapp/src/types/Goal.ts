import { Currency } from "dinero.js"

export default interface Goal {
    id: number
    name: string
    description: string
    goal: number
    balance: number
    currency: Currency
    position: number
    archived: boolean
    fulfilled: {
        reached: boolean
        at: string
    }
    createdAt: string
    updatedAt: string
}