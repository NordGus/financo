import { Kind, KINDS } from "../types/account";

export function accountKindToHuman(kind: Kind): string {
  switch (kind) {
    case KINDS["capital_normal"]:
      return "Capital"
    case KINDS["capital_savings"]:
      return "Savings"
    case KINDS["debt_loan"]:
      return "Loan"
    case KINDS["debt_personal"]:
      return "Personal debt"
    case KINDS["debt_credit"]:
      return "Credit"
    case KINDS["external_expense"]:
      return "Expense"
    case KINDS["external_income"]:
      return "Income"
    case KINDS["system_historic"]:
      return "History"
    default:
      throw new Error(`invalid kind ${kind}`)
  }
}