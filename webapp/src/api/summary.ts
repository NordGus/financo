import Summary from "@/types/Summary";

export async function getSummary(): Promise<Summary> {
    const response = await fetch("/api/summary")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}