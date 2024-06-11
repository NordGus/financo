import Account from "./Account"

export default interface Transaction {
    id: number
    issuedAt: string
    executedAt?: string
    source: Account
    target: Account
    sourceAmount: number
    targetAmount: number
    updatedAt: string
    createdAt: string
}