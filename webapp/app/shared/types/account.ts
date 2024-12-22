
export const KINDS = {
  system_historic: "system_historic",
  capital_normal: "capital_normal",
  capital_savings: "capital_savings",
  debt_personal: "debt_personal",
  debt_loan: "debt_loan",
  debt_credit: "debt_credit",
  external_income: "external_income",
  external_expense: "external_expense"
} as const;

type Kinds = typeof KINDS;

type Kind = Kinds["system_historic"] |
  Kinds["capital_normal"] |
  Kinds["capital_savings"] |
  Kinds["debt_personal"] |
  Kinds["debt_loan"] |
  Kinds["debt_credit"] |
  Kinds["external_income"] |
  Kinds["external_expense"];

function isCapital(kind: Kind) {
  return kind === KINDS.capital_normal
}

function isSavings(kind: Kind) {
  return kind === KINDS.capital_savings
}

function isDebt(kind: Kind) {
  return kind === KINDS.debt_loan ||
    kind === KINDS.debt_personal ||
    kind === KINDS.debt_credit
}

function isLoan(kind: Kind) {
  return kind === KINDS.debt_loan
}

function isPersonalDebt(kind: Kind) {
  return kind === KINDS.debt_personal
}

function isCredit(kind: Kind) {
  return kind === KINDS.debt_credit
}

function isIncome(kind: Kind) {
  return kind === KINDS.external_income
}

function isExpense(kind: Kind) {
  return kind === KINDS.external_expense
}

export { isCapital, isCredit, isDebt, isExpense, isIncome, isLoan, isPersonalDebt, isSavings };

export type { Kind, Kinds };

