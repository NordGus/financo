import { deleteGoal } from "@api/savings-goals"
import { toast } from "@components/ui/use-toast"
import { QueryClient } from "@tanstack/react-query"
import { Params, redirect } from "react-router-dom"

export const action = (queryClient: QueryClient) => async ({
    request, params
}: { request: Request, params: Params }) => {
    if (!params.id) throw new Error('No account ID provided')
    const id = Number(params.id)

    const action = {
        ["delete"]: async () => {
            const deleted = await deleteGoal(id)

            await queryClient.invalidateQueries({ queryKey: ["savings-goals"] })

            toast({
                title: "Deleted",
                description: `${deleted.name} have been deleted`
            })

            return redirect(`/savings-goals`)
        }
    }[request.method.toLowerCase()]

    if (action) return action()

    throw new Response("", { status: 405 })
}