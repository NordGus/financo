import { Currency } from "./currency";
import { Icon } from "./icon";

export {
  isCapital,
  isCategory,
  isCredit,
  isDebt,
  isExpense,
  isIncome,
  isPassive,
  isSavings
};

export type {
  Account,
  AccountKind,
  AccountPreview,
  CategoryKind,
  SystemKind as Kind,
  Kinds,
  PureCategoryKind,
  SystemKind
};

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

type SystemKind = Kinds["history"] |
  Kinds["capital"] |
  Kinds["savings"] |
  Kinds["debt"] |
  Kinds["credit"] |
  Kinds["income"] |
  Kinds["expense"];

type AccountKind = Kinds["capital"] |
  Kinds["savings"] |
  Kinds["debt"] |
  Kinds["credit"];

type CategoryKind = Kinds["debt"] |
  Kinds["credit"] |
  Kinds["income"] |
  Kinds["expense"];

type PureCategoryKind = Kinds["income"] | Kinds["expense"];

interface History {
  at: string | null | undefined
  balance: number | null | undefined
}

interface AdditionalData {
  main: boolean
  balance: number
  history: History
  transactions: number
}

interface Account {
  id: number
  kind: AccountKind
  currency: Currency
  name: string
  description?: string | null
  icon: Icon
  color: string
  capital: number
  additionalData: AdditionalData
  archivedAt: string | null | undefined
  deletedAt: string | null | undefined
  createdAt: string
  updatedAt: string
}

interface AccountPreview {
  id: number
  parentId: number | null
  kind: AccountKind
  currency: Currency
  name: string
  description?: string | null
  color: string
  icon: Icon
  capital: number
  balance: number
  main: boolean
  archivedAt: string | null
  deletedAt: string | null
  createdAt: string
  updatedAt: string
}

function isCapital(kind: SystemKind) {
  return kind === KINDS.capital
}

function isSavings(kind: SystemKind) {
  return kind === KINDS.savings
}

function isPassive(kind: SystemKind) {
  return kind === KINDS.debt || kind === KINDS.credit
}

function isDebt(kind: SystemKind) {
  return kind === KINDS.debt
}

function isCredit(kind: SystemKind) {
  return kind === KINDS.credit
}

function isIncome(kind: SystemKind) {
  return kind === KINDS.income
}

function isExpense(kind: SystemKind) {
  return kind === KINDS.expense
}

function isCategory(kind: SystemKind) {
  return kind === KINDS.expense || kind === KINDS.income
}
