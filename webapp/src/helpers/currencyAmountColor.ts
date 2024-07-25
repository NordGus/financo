export default function currencyAmountColor(amount: number): string {
    if (amount > 0) return 'text-green-500'
    if (amount < 0) return 'text-red-500'

    return 'text-zinc-400'
}