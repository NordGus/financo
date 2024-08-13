import { Params, redirect } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";

import Transaction from "@/types/Transaction";

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

            return redirect(`/transactions`)
        default:
            throw new Response("", { status: 405 })
    }
}

interface Props {
    transaction: Transaction
    setOpen: Dispatch<SetStateAction<boolean>>
}

export default function Update({ transaction }: Props) {
    return (
        <span className="text-zinc-950 dark:text-zinc-50">
            {JSON.stringify(transaction)}
        </span>
    )
}