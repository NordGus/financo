import { deleteGoal, markSavingsGoalAsAchieved } from "@api/savings-goals"
import { toast } from "@components/ui/use-toast"
import { normalizeDateForServer } from "@helpers/normalizeDate"
import { QueryClient } from "@tanstack/react-query"
import moment from "moment"
import { Params, redirect } from "react-router-dom"

export const action = (queryClient: QueryClient) => async ({
    request, params
}: { request: Request, params: Params }) => {
    if (!params.id) throw new Error('No account ID provided')
    const id = Number(params.id)

    console.log(request.method.toLowerCase())

    const action = {
        ["delete"]: async () => {
            try {
                const deleted = await deleteGoal(id)

                toast({
                    title: "Deleted",
                    description: `${deleted.name} have been deleted`
                })

                await queryClient.invalidateQueries({ queryKey: ["achievements", "savings-goals", "active"] })
            } catch (e) {
                console.log(e)

                toast({
                    variant: "destructive",
                    title: "Something went wrong",
                    description: "There was a problem while deleting the savings goal"
                })
            }

            return redirect(`/achievements`)
        },
        ["post"]: async () => {
            try {
                const formData = await request.formData()
                const id = Number(formData.get("id")!)
                const achievedAt = normalizeDateForServer(
                    moment(formData.get("achievedAt")!.toString()).toDate()
                ).toISOString()

                const marked = await markSavingsGoalAsAchieved({ id, achievedAt })

                toast({
                    title: `${marked.name} Achieved!`,
                    description: marked.description
                })

                await queryClient.invalidateQueries({ queryKey: ["achievements", "savings-goals", "active"] })
            } catch (e) {
                console.log(e)

                toast({
                    variant: "destructive",
                    title: "Something went wrong",
                    description: "There was a problem while deleting the savings goal"
                })
            }

            return redirect(`/achievements`)
        }
    }[request.method.toLowerCase()]

    if (action) return action()

    throw new Response("", { status: 405 })
}