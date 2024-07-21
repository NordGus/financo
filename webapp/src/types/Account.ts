import { Currency } from "dinero.js"

export enum Kind {
    SystemHistoric = "system_historic",
    CapitalNormal = "capital_normal",
    CapitalSavings = "capital_savings",
    DebtLoan = "debt_loan",
    DebtPersonal = "debt_personal",
    DebtCredit = "debt_credit",
    ExternalIncome = "external_income",
    ExternalExpense = "external_expense",
}

export enum Icon {
    Base = "base"
}

export interface Preview {
    id: number
    kind: Kind
    currency: Currency
    name: string
    description: string
    balance: number
    capital: number
    color: string
    icon: Icon
    archivedAt: string | null
    createdAt: string
    updatedAt: string
    children?: Preview[] | null
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
        at: string
    }
    color: string
    icon: Icon
    archived: boolean
    createdAt: string
    updatedAt: string
    children: Account[]
}