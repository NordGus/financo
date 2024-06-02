import { Kind } from "@/types/Account";

export default function kindToHuman(kind: Kind): string {
    return {
        [Kind.CapitalNormal]: "Bank Account",
        [Kind.CapitalSavings]: "Savings",
        [Kind.DebtCredit]: "Credit",
        [Kind.DebtLoan]: "Loan",
        [Kind.DebtPersonal]: "Personal Loan",
        [Kind.ExternalIncome]: "Income",
        [Kind.ExternalExpense]: "Expense"
    }[kind]
}