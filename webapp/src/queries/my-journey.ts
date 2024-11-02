import { getTimeline } from "@api/my-journey"
import { staleTimeDefault } from "./client"

const timelineQuery = {
    queryKey: ["my-journey", "achievements"],
    queryFn: getTimeline,
    staleTime: staleTimeDefault,
}

export { timelineQuery }
