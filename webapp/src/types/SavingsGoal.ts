import { Currency } from "dinero.js"
import moment from "moment"

export const placeholder: SavingsGoal[] = [
    {
        id: 1,
        name: "My first emergency fund",
        description: "A journey of a thousand kilometers start with a single step",
        target: 100000,
        currency: "EUR",
        balance: 100000,
        position: 1,
        achievedAt: null,
        archivedAt: null,
        createdAt: moment().add({ month: -3 }).toDate().toISOString(),
        updatedAt: moment().add({ month: -3 }).toDate().toISOString()
    },
    {
        id: 2,
        name: "This is not even my final form",
        description: "Take the emergency fund to 3 month's income",
        target: 600000,
        currency: "EUR",
        balance: 600000,
        position: 2,
        achievedAt: null,
        archivedAt: null,
        createdAt: moment().add({ month: -3 }).toDate().toISOString(),
        updatedAt: moment().add({ month: -3 }).toDate().toISOString()
    },
    {
        id: 3,
        name: "Inner Peace",
        description: "Your emergency fund gives you 3 month's runway",
        target: 1200000,
        currency: "EUR",
        balance: 1200000,
        position: 3,
        achievedAt: null,
        archivedAt: null,
        createdAt: moment().add({ month: -3 }).toDate().toISOString(),
        updatedAt: moment().add({ month: -3 }).toDate().toISOString()
    },
    {
        id: 4,
        name: "Harmony within, Hurricane without",
        description: "Now your emergency fund has 12 month's income",
        target: 2400000,
        currency: "EUR",
        balance: 1200000,
        position: 4,
        achievedAt: null,
        archivedAt: null,
        createdAt: moment().add({ month: -3 }).toDate().toISOString(),
        updatedAt: moment().add({ month: -3 }).toDate().toISOString()
    },
    {
        id: 5,
        name: "Upgrades for my Desktop",
        description: null,
        target: 100000,
        currency: "EUR",
        balance: 0,
        position: 5,
        achievedAt: null,
        archivedAt: null,
        createdAt: moment().add({ month: -3 }).toDate().toISOString(),
        updatedAt: moment().add({ month: -3 }).toDate().toISOString()
    },
    {
        id: 6,
        name: "Investment for the Studio",
        description: "Buying some hardware to create games better",
        target: 600000,
        currency: "EUR",
        balance: 0,
        position: 6,
        achievedAt: null,
        archivedAt: null,
        createdAt: moment().add({ month: -3 }).toDate().toISOString(),
        updatedAt: moment().add({ month: -3 }).toDate().toISOString()
    },
    {
        id: 7,
        name: "Honeymoon",
        description: "A little treat for my spouse",
        target: 2000000,
        currency: "EUR",
        balance: 0,
        position: 7,
        achievedAt: null,
        archivedAt: null,
        createdAt: moment().add({ month: -3 }).toDate().toISOString(),
        updatedAt: moment().add({ month: -3 }).toDate().toISOString()
    }
]

export interface SavingsGoal {
    id: number
    name: string
    description: string | null
    target: number
    currency: Currency
    balance: number
    position: number
    achievedAt: string | null
    archivedAt: string | null
    createdAt: string
    updatedAt: string
}