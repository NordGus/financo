export default interface Account {
    id: number
    kind: string
    name: string
    description: string
    currency: string
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