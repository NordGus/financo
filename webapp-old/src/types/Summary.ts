import { Currency } from "dinero.js"

export interface Summary {
    amount: number
    currency: Currency,
    series: { date: string, amount: number }[] | null
}