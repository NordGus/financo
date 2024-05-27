export default interface Goal {
    id: number
    name: string
    description: string
    goal: number
    currency: string
    position: number
    archived: boolean
    fulfilled: {
        reached: boolean
        at: Date
    }
    createdAt: Date
    updatedAt: Date
}