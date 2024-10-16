import { Achievable } from "@/types/achievable";
import { Settings as SavingsGoals } from "@/types/savings-goal";

export async function getAchieved(): Promise<Achievable<SavingsGoals>> {
    const response = await fetch("/api/my_journey/achieved")

    if (!response.ok) throw response

    return response.json()
}
