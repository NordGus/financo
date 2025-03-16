export const CURRENCIES = {
  CAD: "CAD",
  USD: "USD",
  EUR: "EUR",
  CHF: "CHF",
  GBP: "GBP",
  MULTI: "MULTI",
} as const;

type Currencies = typeof CURRENCIES;

type Currency =
  Currencies["CAD"] |
  Currencies["USD"] |
  Currencies["EUR"] |
  Currencies["CHF"] |
  Currencies["GBP"] |
  Currencies["MULTI"];

type Entry = {
  code: Currency
  name: string
};

export type {
  Currencies,
  Currency,
  Entry
};

