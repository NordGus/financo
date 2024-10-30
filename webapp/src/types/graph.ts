import { Currency } from "dinero.js"

interface Series {
    date: string
    amount: number
}

interface Summary {
    amount: number
    currency: Currency,
    series: Series[] | null
}

export type { Series, Summary }
