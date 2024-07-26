import { Kind } from "@/types/Account";

export default function kindToHuman(kind: Kind): string {
    return {
        [Kind.CapitalNormal]: "Bank",
        [Kind.CapitalSavings]: "Savings",
        [Kind.DebtCredit]: "Credit",
        [Kind.DebtLoan]: "Loan",
        [Kind.DebtPersonal]: "Personal",
        [Kind.ExternalIncome]: "Income",
        [Kind.ExternalExpense]: "Expense",
        [Kind.SystemHistoric]: "Historic"
    }[kind]
}