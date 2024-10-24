import { deleteTransaction } from "@api/transactions";
import { toast } from "@components/ui/use-toast";
import { QueryClient } from "@tanstack/react-query";
import { Params, redirect } from "react-router-dom";

export const action = (queryClient: QueryClient) => async ({
    request, params
}: { request: Request, params: Params }) => {
    if (!params.id) throw new Error('No account ID provided')
    const id = Number(params.id)

    const action = {
        ["delete"]: async () => {
            const deleted = await deleteTransaction(id)

            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["transactions"] }),
                queryClient.invalidateQueries({ queryKey: ["accounts"] })
            ])

            toast({
                title: "Deleted",
                description: `Transaction between ${deleted.source.name} and ${deleted.target.name} have been deleted`
            })

            return redirect(`/ledger`)
        }
    }[request.method.toLowerCase()]

    if (action) return action()

    throw new Response("", { status: 405 })
}