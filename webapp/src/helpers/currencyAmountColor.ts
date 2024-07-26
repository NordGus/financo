export default function currencyAmountColor(amount: number, transaction: boolean = true): string {
    if (amount > 0 && transaction) return 'text-green-500'
    if (amount > 0) return 'text-zinc-950 dark:text-zinc-50'
    if (amount < 0) return 'text-red-500'

    return 'text-zinc-500'
}