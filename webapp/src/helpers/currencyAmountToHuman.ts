import DineroFactory, { Currency } from "dinero.js";

export default function currencyAmountToHuman(
    amount: number,
    currency: Currency,
    precision: number = 2
): string {
    return DineroFactory({ amount, currency, precision }).toFormat()
}