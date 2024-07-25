import { QueryClient } from "@tanstack/react-query";
import { LoaderFunction, LoaderFunctionArgs } from "react-router-dom";

export function loader(_queryClient: QueryClient): LoaderFunction {
    return async (_props: LoaderFunctionArgs) => {
        return {}
    }
}

export default function Index() {
    return (
        <>

        </>
    )
}