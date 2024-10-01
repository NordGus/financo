import { QueryClient } from "@tanstack/react-query"
import moment from "moment"
import { LoaderFunctionArgs } from "react-router-dom"

export const loader = (_queryClient: QueryClient) => async (_props: LoaderFunctionArgs) => {
    return { timestamp: moment().toISOString() }
}