import { Currency } from "dinero.js"

export interface SummaryItem {
    amount: number
    currency: Currency
}

export default interface Summary {
    capital: SummaryItem[]
    debt: SummaryItem[]
    total: SummaryItem[]
}