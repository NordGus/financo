import { useLoaderData, useOutletContext } from "react-router-dom"
import { AchievementsOutletContext } from "../layout"
import { loader } from "./loader"

export default function Index() {
    const { onSetSavingsGoal, onCreateSavingsGoal } = useOutletContext<AchievementsOutletContext>()
    const { timestamp } = useLoaderData() as Awaited<ReturnType<ReturnType<typeof loader>>>

    return (
        <div>
            Hello There
        </div>
    )
}