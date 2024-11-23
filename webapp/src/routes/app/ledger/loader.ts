import { QueryClient } from "@tanstack/react-query"
import { LoaderFunctionArgs } from "react-router"

export const loader = (_queryClient: QueryClient) => async (_props: LoaderFunctionArgs) => {
    return { breadcrumb: "Ledger" }
}