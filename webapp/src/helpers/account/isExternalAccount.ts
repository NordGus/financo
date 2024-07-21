import { Kind } from "@/types/Account";

export default function isExternalAccount(kind: Kind): boolean {
    return [Kind.ExternalExpense, Kind.ExternalIncome].includes(kind)
}