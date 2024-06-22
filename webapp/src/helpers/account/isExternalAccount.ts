import { Kind } from "@/types/Account";

export default function isDebtAccount(kind: Kind): boolean {
    return [Kind.ExternalExpense, Kind.ExternalIncome].includes(kind)
}