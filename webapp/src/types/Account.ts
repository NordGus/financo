import { Currency } from "dinero.js"

export enum Kind {
    CapitalNormal = "capital_normal",
    CapitalSavings = "capital_savings",
    DebtLoan = "debt_loan",
    DebtPersonal = "debt_personal",
    DebtCredit = "debt_credit",
    ExternalIncome = "external_income",
    ExternalExpense = "external_expense",
}

export default interface Account {
    id: number
    kind: Kind
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