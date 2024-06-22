import { Kind } from "@/types/Account";

export default function isDebtAccount(kind: Kind): boolean {
    return [Kind.DebtLoan, Kind.DebtCredit, Kind.DebtPersonal].includes(kind)
}