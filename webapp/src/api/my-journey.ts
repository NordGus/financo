import { Milestone } from "@/types/achievement";

export async function getTimeline(): Promise<Milestone[]> {
    const response = await fetch("/api/my-journey/timeline")

    if (!response.ok) throw response

    return response.json()
}
