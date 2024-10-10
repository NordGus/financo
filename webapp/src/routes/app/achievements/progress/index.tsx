import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert"
import { InfoIcon } from "lucide-react"
import { useOutletContext } from "react-router-dom"
import { AchievementsOutletContext } from "../layout"
import SavingsGoals from "../savings-goals"

export default function Index() {
    const { onSetSavingsGoal, onCreateSavingsGoal } = useOutletContext<AchievementsOutletContext>()
    // const { timestamp } = useLoaderData() as Awaited<ReturnType<ReturnType<typeof loader>>>

    return (
        <div className="flex flex-row justify-center gap-4">
            <div className="flex flex-col gap-4 w-[30%]">
                <SavingsGoals.List
                    onCreateSavingsGoal={onCreateSavingsGoal}
                    onSetSavingsGoal={onSetSavingsGoal}
                />
            </div>
            <div className="flex flex-col gap-4 w-[30%]">
                <Alert>
                    <InfoIcon className="h-5 w-5" />
                    <AlertTitle>More to come!</AlertTitle>
                    <AlertDescription>
                        At the moment financo only supports Savings Goals achievements, in the future there would be more kinds of achievements to follow your financial journey.
                    </AlertDescription>
                </Alert>
            </div>
        </div>
    )
}