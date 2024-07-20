import { Currency } from "dinero.js"
import { Icon, Kind } from "./Account"

interface Account {
    id: number
    kind: Kind
    name: string
    currency: Currency
    color: string
    icon: Icon
    createdAt: string
    updatedAt: string
    parent?: Account | null
}

export default interface Transaction {
    id: number
    issuedAt: string
    executedAt: string | null
    source: Account
    target: Account
    sourceAmount: number
    targetAmount: number
    updatedAt: string
    createdAt: string
}