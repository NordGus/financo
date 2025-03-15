
export const KINDS = {
  history: "history",
  capital: "capital",
  savings: "savings",
  debt: "debt",
  credit: "credit",
  income: "income",
  expense: "expense"
} as const;

type Kinds = typeof KINDS;

type Kind = Kinds["history"] |
  Kinds["capital"] |
  Kinds["savings"] |
  Kinds["debt"] |
  Kinds["credit"] |
  Kinds["income"] |
  Kinds["expense"];

function isCapital(kind: Kind) {
  return kind === KINDS.capital
}

function isSavings(kind: Kind) {
  return kind === KINDS.savings
}

function isPassive(kind: Kind) {
  return kind === KINDS.debt || kind === KINDS.credit
}

function isLoan(kind: Kind) {
  return kind === KINDS.debt
}

function isCredit(kind: Kind) {
  return kind === KINDS.credit
}

function isIncome(kind: Kind) {
  return kind === KINDS.income
}

function isExpense(kind: Kind) {
  return kind === KINDS.expense
}

function isCategory(kind: Kind) {
  return kind === KINDS.expense || kind === KINDS.income
}

export { isCapital, isCategory, isCredit, isExpense, isIncome, isLoan, isPassive, isSavings };

export type { Kind, Kinds };

