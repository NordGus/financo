import { deleteAccount } from "@api/accounts"
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
            const deleted = await deleteAccount(id)

            await Promise.allSettled([
                queryClient.invalidateQueries({ queryKey: ["accounts"] }),
                queryClient.invalidateQueries({ queryKey: ["transactions"] })
            ])

            toast({
                title: "Deleted",
                description: `${deleted.name} and its children have been deleted`
            })

            return redirect(`/accounts`)
        }
    }[request.method.toLowerCase()]

    if (action) return action()

    throw new Response("", { status: 405 })
}