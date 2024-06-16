import currencyAmountColor from "@helpers/currencyAmountColor";

import { Kind } from "@/types/Account";

export default function currencySourceAmountColor(sourceKind: Kind, targetKind: Kind) {
    return currencyAmountColor({
        [Kind.CapitalNormal]: {
            [Kind.DebtLoan]: -1,
            [Kind.DebtPersonal]: -1,
            [Kind.DebtCredit]: -1,
            [Kind.ExternalIncome]: -1,
            [Kind.ExternalExpense]: -1
        },
        [Kind.CapitalSavings]: {
            [Kind.DebtLoan]: -1,
            [Kind.DebtPersonal]: -1,
            [Kind.DebtCredit]: -1,
            [Kind.ExternalIncome]: -1,
            [Kind.ExternalExpense]: -1
        },
        [Kind.DebtLoan]: {
            [Kind.CapitalNormal]: 1,
            [Kind.CapitalSavings]: 1,
            [Kind.DebtCredit]: -1,
            [Kind.ExternalIncome]: -1,
            [Kind.ExternalExpense]: -1
        },
        [Kind.DebtPersonal]: {
            [Kind.CapitalNormal]: 1,
            [Kind.CapitalSavings]: 1,
            [Kind.DebtCredit]: -1,
            [Kind.ExternalIncome]: -1,
            [Kind.ExternalExpense]: -1
        },
        [Kind.DebtCredit]: {
            [Kind.CapitalNormal]: 1,
            [Kind.CapitalSavings]: 1,
            [Kind.DebtLoan]: -1,
            [Kind.DebtPersonal]: -1,
            [Kind.DebtCredit]: -1,
            [Kind.ExternalIncome]: -1,
            [Kind.ExternalExpense]: -1
        },
        [Kind.ExternalIncome]: {
            [Kind.CapitalNormal]: 1,
            [Kind.CapitalSavings]: 1,
            [Kind.DebtLoan]: 1,
            [Kind.DebtPersonal]: 1,
            [Kind.DebtCredit]: 1,
            [Kind.ExternalExpense]: -1
        },
        [Kind.ExternalExpense]: {
            [Kind.CapitalNormal]: 1,
            [Kind.CapitalSavings]: 1,
            [Kind.DebtLoan]: 1,
            [Kind.DebtPersonal]: 1,
            [Kind.DebtCredit]: 1,
            [Kind.ExternalIncome]: 1
        },
    }[sourceKind][targetKind] || 0)
}