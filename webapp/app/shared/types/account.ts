
const _kinds = {
  system_historic: "system_historic",
  capital_normal: "capital_normal",
  capital_savings: "capital_savings",
  debt_personal: "debt_personal",
  debt_loan: "debt_loan",
  debt_credit: "debt_credit",
  external_income: "external_income",
  external_expense: "external_expense"
} as const;

type Kinds = typeof _kinds;

type Kind = Kinds["system_historic"] |
  Kinds["capital_normal"] |
  Kinds["capital_savings"] |
  Kinds["debt_personal"] |
  Kinds["debt_loan"] |
  Kinds["debt_credit"] |
  Kinds["external_income"] |
  Kinds["external_expense"];

function isCapital(kind: Kind) {
  return kind === _kinds.capital_normal
}

function isSavings(kind: Kind) {
  return kind === _kinds.capital_savings
}

function isDebt(kind: Kind) {
  return kind === _kinds.debt_loan ||
    kind === _kinds.debt_personal ||
    kind === _kinds.debt_credit
}

function isLoan(kind: Kind) {
  return kind === _kinds.debt_loan
}

function isPersonalDebt(kind: Kind) {
  return kind === _kinds.debt_personal
}

function isCredit(kind: Kind) {
  return kind === _kinds.debt_credit
}

function isIncome(kind: Kind) {
  return kind === _kinds.external_income
}

function isExpense(kind: Kind) {
  return kind === _kinds.external_expense
}

export { isCapital, isCredit, isDebt, isExpense, isIncome, isLoan, isPersonalDebt, isSavings };

export type { Kind };

