export function currencyAmountColor(amount: number): string {
  if (amount < 0) return "text-red-500"
  return "text-foreground"
}