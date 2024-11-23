import { timelineQuery } from "@queries/my-journey"
import { QueryClient } from "@tanstack/react-query"
import moment from "moment"
import { LoaderFunctionArgs } from "react-router"

export const loader = (queryClient: QueryClient) => async (_props: LoaderFunctionArgs) => {
    const timeline = await queryClient.ensureQueryData(timelineQuery)

    return {
        breadcrumb: "My Financial Journey",
        timeline,
        timestamp: moment().toISOString(),
    }
}