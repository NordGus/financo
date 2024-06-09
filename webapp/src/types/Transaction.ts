import Account from "./Account"

export default interface Transaction {
    id: number
    issuedAt: Date
    executedAt?: Date
    source: Account
    target: Account
    sourceAmount: number
    targetAmount: number
    updatedAt: Date
    createdAt: Date
}