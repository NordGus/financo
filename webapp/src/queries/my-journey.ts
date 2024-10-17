import { getAchieved } from "@api/my-journey"
import { staleTimeDefault } from "./client"

const achievedAchievements = {
    queryKey: ["my-journey", "achievements"],
    queryFn: getAchieved,
    staleTime: staleTimeDefault,
}

export { achievedAchievements }
