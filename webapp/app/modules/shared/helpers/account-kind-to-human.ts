import { Kind, KINDS } from "../types/account";

export function accountKindToHuman(kind: Kind): string {
  switch (kind) {
    case KINDS["capital"]:
      return "Capital"
    case KINDS["savings"]:
      return "Savings"
    case KINDS["debt"]:
      return "Debt"
    case KINDS["credit"]:
      return "Credit"
    case KINDS["expense"]:
      return "Expense"
    case KINDS["income"]:
      return "Income"
    case KINDS["history"]:
      return "History"
    default:
      throw new Error(`invalid kind ${kind}`)
  }
}