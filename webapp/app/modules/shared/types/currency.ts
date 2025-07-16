export const SYSTEM_CURRENCIES = {
  CAD: "CAD",
  USD: "USD",
  EUR: "EUR",
  CHF: "CHF",
  GBP: "GBP",
  MULTI: "MULTI",
} as const;

export const CURRENCIES = {
  CAD: "CAD",
  USD: "USD",
  EUR: "EUR",
  CHF: "CHF",
  GBP: "GBP",
} as const;

export const CurrenciesForZodEnum = [
  CURRENCIES.CAD,
  CURRENCIES.USD,
  CURRENCIES.EUR,
  CURRENCIES.CHF,
  CURRENCIES.GBP,
] as const

export const SystemCurrenciesForZodEnum = [
  SYSTEM_CURRENCIES.CAD,
  SYSTEM_CURRENCIES.USD,
  SYSTEM_CURRENCIES.EUR,
  SYSTEM_CURRENCIES.CHF,
  SYSTEM_CURRENCIES.GBP,
  SYSTEM_CURRENCIES.MULTI,
] as const

type SystemCurrencies = typeof SYSTEM_CURRENCIES;

type Currencies = typeof CURRENCIES;

type SystemCurrency =
  SystemCurrencies["CAD"] |
  SystemCurrencies["USD"] |
  SystemCurrencies["EUR"] |
  SystemCurrencies["CHF"] |
  SystemCurrencies["GBP"] |
  SystemCurrencies["MULTI"];

type Currency =
  Currencies["CAD"] |
  Currencies["USD"] |
  Currencies["EUR"] |
  Currencies["CHF"] |
  Currencies["GBP"];

type Entry = {
  code: Currency
  name: string
};

export type {
  Currencies, Currency, Entry, SystemCurrencies, SystemCurrency
};

