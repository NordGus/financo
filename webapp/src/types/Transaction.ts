import { Currency } from "dinero.js"
import { Icon, Kind } from "./Account"

export interface Create {
    kind: Kind
    issuedAt: string
    executedAt: string | null
    notes: string | null
    sourceID: number
    targetID: number
    sourceAmount: number
    targetAmount: number
}

export interface Update {
    id: number
    kind: Kind
    issuedAt: string
    executedAt: string | null
    notes: string | null
    sourceID: number
    targetID: number
    sourceAmount: number
    targetAmount: number
}

export interface Account {
    id: number
    kind: Kind
    name: string
    currency: Currency
    color: string
    icon: Icon
    archivedAt: string | null
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
    notes: string | null
    sourceAmount: number
    targetAmount: number
    updatedAt: string
    createdAt: string
}