import { deleteTransaction } from "@api/transactions";
import { toast } from "@components/ui/use-toast";
import { QueryClient } from "@tanstack/react-query";
import { Params, redirect } from "react-router";

export const action = (queryClient: QueryClient) => async ({
    request, params
}: { request: Request, params: Params }) => {
    if (!params.id) throw new Error('No account ID provided')
    const id = Number(params.id)

    const action = {
        ["delete"]: async () => {
            try {
                const deleted = await deleteTransaction(id)

                Promise.all([
                    queryClient.invalidateQueries({ queryKey: ["transactions"] }),
                    queryClient.invalidateQueries({ queryKey: ["accounts"] })
                ])

                toast({
                    title: "Deleted",
                    description: `Transaction between ${deleted.source.name} and ${deleted.target.name} have been deleted`
                })
            } catch (e) {
                console.error(e)

                toast({
                    variant: "destructive",
                    title: "Something went wrong",
                    description: "There was a problem while deleting the transaction"
                })
            }

            return redirect(`/ledger`, 302)
        }
    }[request.method.toLowerCase()]

    if (action) return action()

    throw new Response("", { status: 405 })
}