import DineroFactory from "dinero.js";
import { Currency } from "../types/currency";

type Options = {
  precision?: number;
  withSign?: boolean;
}

export function currencyAmountToHuman(amount: number, currency: Currency, options?: Options): string {
  const { precision = 2, withSign = false } = options ?? { precision: 2, withSign: false }

  if (withSign) return DineroFactory({ amount, currency, precision }).toFormat()

  return DineroFactory({ amount: Math.abs(amount), currency, precision }).toFormat()
}