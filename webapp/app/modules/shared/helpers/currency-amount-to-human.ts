import DineroFactory from "dinero.js";
import { Currency } from "../types/currency";

export function currencyAmountToHuman(amount: number, currency: Currency, precision = 2): string {
  return DineroFactory({ amount: Math.abs(amount), currency, precision }).toFormat()
}