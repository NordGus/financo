import { Kind } from "@/types/Account";

export function isExpenseAccount(kind: Kind): boolean {
    return Kind.ExternalExpense === kind
}

export function isIncomeAccount(kind: Kind): boolean {
    return Kind.ExternalIncome === kind
}

export default function isExternalAccount(kind: Kind): boolean {
    return [Kind.ExternalExpense, Kind.ExternalIncome].includes(kind)
}