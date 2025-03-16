import DineroFactory from "dinero.js";
import { Currencies } from "../types/currency";

type Currency =
  Currencies["CAD"] |
  Currencies["USD"] |
  Currencies["EUR"] |
  Currencies["CHF"] |
  Currencies["GBP"];

export function currencyAmountToHuman(amount: number, currency: Currency, precision = 2): string {
  return DineroFactory({ amount: Math.abs(amount), currency, precision }).toFormat()
}