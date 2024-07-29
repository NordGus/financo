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
    description: string | null
    balance: number
    capital: number
    color: string
    icon: Icon
    archivedAt: string | null
    createdAt: string
    updatedAt: string
    children?: Preview[] | null
}

export default interface Detailed {
    id: number
    kind: Kind
    currency: Currency
    name: string
    description: string | null
    balance: number
    capital: number
    history: { balance: number, at: string } | null
    color: string
    icon: Icon
    archivedAt: string | null
    createdAt: string
    updatedAt: string
    children?: Detailed[] | null
}

export interface Update {
    currency: Currency
    name: string
    description: string | null | undefined
    capital: number
    history: {
        present: boolean,
        balance: number | null,
        at: string | null
    }
    color: string
    icon: Icon
    archive: boolean
    children: UpdateChild[] | null
}

export interface UpdateChild {
    id?: number
    kind: Kind
    currency: Currency
    name: string
    description: string | null | undefined
    capital: number
    history: {
        present: boolean,
        balance: number | null,
        at: string | null
    }
    color: string
    icon: Icon
    archive: boolean
    delete: boolean
}