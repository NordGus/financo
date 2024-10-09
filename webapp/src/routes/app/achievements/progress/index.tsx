import { useLoaderData, useOutletContext } from "react-router-dom"
import { AchievementsOutletContext } from "../layout"
import SavingsGoals from "../savings-goals"
import { loader } from "./loader"

export default function Index() {
    const { onSetSavingsGoal, onCreateSavingsGoal } = useOutletContext<AchievementsOutletContext>()
    const { timestamp } = useLoaderData() as Awaited<ReturnType<ReturnType<typeof loader>>>

    return (
        <div className="grid grid-cols-3 gap-2">
            <SavingsGoals.List onCreateSavingsGoal={onCreateSavingsGoal} onSetSavingsGoal={onSetSavingsGoal} />
        </div>
    )
}