import { Currency } from "dinero.js"

export default interface Account {
    id: number
    kind: string
    name: string
    description: string
    currency: Currency
    balance: number
    capital: number
    history: {
        present: boolean
        capital: number
        at: Date
    }
    archived: boolean
    createdAt: Date
    updatedAt: Date
    children: Account[]
}