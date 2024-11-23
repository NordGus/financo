import { Currency } from "@/types/currency";

export async function getCurrencies(): Promise<Currency[]> {
    const response = await fetch("/api/currencies")

    if (!response.ok) throw response

    return response.json()
}