import { achievedAchievements } from "@queries/my-journey"
import { QueryClient } from "@tanstack/react-query"
import moment from "moment"
import { LoaderFunctionArgs } from "react-router-dom"

export const loader = (queryClient: QueryClient) => async (_props: LoaderFunctionArgs) => {
    const achievements = await queryClient.ensureQueryData(achievedAchievements)

    return {
        breadcrumb: "My Financial Journey",
        achievements,
        timestamp: moment().toISOString(),
    }
}