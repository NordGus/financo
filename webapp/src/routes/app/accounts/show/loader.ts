import { accountQueryOptions } from "@queries/accounts"
import { QueryClient } from "@tanstack/react-query"
import { LoaderFunctionArgs } from "react-router-dom"

export const loader = (queryClient: QueryClient) => async ({ params }: LoaderFunctionArgs) => {
    if (!params.id) throw new Error('No account ID provided')
    const id = Number(params.id)

    const account = await queryClient.ensureQueryData(accountQueryOptions(id))

    return { id: account.id, breadcrumb: "Edit Account" }
}