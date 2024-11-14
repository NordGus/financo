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
            try {
                const deleted = await deleteAccount(id)

                Promise.allSettled([
                    queryClient.invalidateQueries({ queryKey: ["accounts"] }),
                    queryClient.invalidateQueries({ queryKey: ["transactions"] })
                ])

                toast({
                    title: "Deleted",
                    description: `${deleted.name} and its children have been deleted`
                })
            } catch (e) {
                console.error(e)

                toast({
                    variant: "destructive",
                    title: "Something went wrong",
                    description: "There was a problem while deleting the account"
                })
            }

            return redirect(`/accounts`, 302)
        }
    }[request.method.toLowerCase()]

    if (action) return await action()

    throw new Response("", { status: 405 })
}