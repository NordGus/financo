import { useLoaderData, useOutletContext } from "react-router-dom"
import { AchievementsOutletContext } from "../layout"
import { loader } from "./loader"

export default function MyJourney() {
    const { onSetSavingsGoal } = useOutletContext<AchievementsOutletContext>()
    const { timestamp } = useLoaderData() as Awaited<ReturnType<ReturnType<typeof loader>>>

    return (
        <div>
            This is how far I've come
        </div>
    )
}