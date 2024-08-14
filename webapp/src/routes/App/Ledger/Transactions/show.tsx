import { Params, redirect } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";

import { deleteTransaction } from "@api/transactions";

import { toast } from "@components/ui/use-toast"

export const action = (queryClient: QueryClient) => async ({
    request, params
}: { request: Request, params: Params }) => {
    if (!params.id) throw new Error('No account ID provided')
    const id = Number(params.id)

    switch (request.method.toLowerCase()) {
        case "delete":
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
        default:
            throw new Response("", { status: 405 })
    }
}

