import { Currency } from "dinero.js"
import moment from "moment"
import { Achievable, Kind } from "./achievable"

export const placeholder: SavingsGoal[] = [
    {
        id: 1,
        kind: Kind.SavingsGoal,
        name: "My first emergency fund",
        description: "A journey of a thousand kilometers start with a single step",
        settings: {
            position: 1,
            target: 100000,
            saved: 100000,
            currency: "EUR",
        },
        achievedAt: null,
        archivedAt: null,
        createdAt: moment().add({ month: -3 }).toDate().toISOString(),
        updatedAt: moment().add({ month: -3 }).toDate().toISOString()
    },
    {
        id: 2,
        kind: Kind.SavingsGoal,
        name: "This is not even my final form",
        description: "Take the emergency fund to 3 month's income",
        settings: {
            position: 2,
            target: 600000,
            saved: 600000,
            currency: "EUR",
        },
        achievedAt: null,
        archivedAt: null,
        createdAt: moment().add({ month: -3 }).toDate().toISOString(),
        updatedAt: moment().add({ month: -3 }).toDate().toISOString()
    },
    {
        id: 3,
        kind: Kind.SavingsGoal,
        name: "Inner Peace",
        description: "Your emergency fund gives you 3 month's runway",
        settings: {
            position: 3,
            target: 1200000,
            saved: 1200000,
            currency: "EUR",
        },
        achievedAt: null,
        archivedAt: null,
        createdAt: moment().add({ month: -3 }).toDate().toISOString(),
        updatedAt: moment().add({ month: -3 }).toDate().toISOString()
    },
    {
        id: 4,
        kind: Kind.SavingsGoal,
        name: "Harmony within, Hurricane without",
        description: "Now your emergency fund has 12 month's income",
        settings: {
            position: 4,
            target: 2400000,
            saved: 1200000,
            currency: "EUR",
        },
        achievedAt: null,
        archivedAt: null,
        createdAt: moment().add({ month: -3 }).toDate().toISOString(),
        updatedAt: moment().add({ month: -3 }).toDate().toISOString()
    },
    {
        id: 5,
        kind: Kind.SavingsGoal,
        name: "Upgrades for my Desktop",
        description: null,
        settings: {
            position: 5,
            target: 100000,
            saved: 0,
            currency: "EUR",
        },
        achievedAt: null,
        archivedAt: null,
        createdAt: moment().add({ month: -3 }).toDate().toISOString(),
        updatedAt: moment().add({ month: -3 }).toDate().toISOString()
    },
    {
        id: 6,
        kind: Kind.SavingsGoal,
        name: "Investment for the Studio",
        description: "Buying some hardware to create games better",
        settings: {
            position: 6,
            target: 600000,
            saved: 0,
            currency: "EUR",
        },
        achievedAt: null,
        archivedAt: null,
        createdAt: moment().add({ month: -3 }).toDate().toISOString(),
        updatedAt: moment().add({ month: -3 }).toDate().toISOString()
    },
    {
        id: 7,
        kind: Kind.SavingsGoal,
        name: "Honeymoon",
        description: "A little treat for my spouse",
        settings: {
            position: 7,
            target: 2000000,
            saved: 0,
            currency: "EUR",
        },
        achievedAt: null,
        archivedAt: null,
        createdAt: moment().add({ month: -3 }).toDate().toISOString(),
        updatedAt: moment().add({ month: -3 }).toDate().toISOString()
    },
    {
        id: 8,
        kind: Kind.SavingsGoal,
        name: "To the forest",
        description: "For that mountain cabin",
        settings: {
            position: 7,
            target: 2000000,
            saved: 0,
            currency: "EUR",
        },
        achievedAt: null,
        archivedAt: null,
        createdAt: moment().add({ month: -3 }).toDate().toISOString(),
        updatedAt: moment().add({ month: -3 }).toDate().toISOString()
    }
]

type Settings = { position: number, target: number, saved: number, currency: Currency }
type SavingsGoal = Achievable<Settings>

interface Active {
    currency: Currency
    goals: SavingsGoal[]
}

export type { Active, SavingsGoal, Settings }
