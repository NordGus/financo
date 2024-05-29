import { Link, LoaderFunctionArgs, useLoaderData, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { queryClient, staleTimeDefault } from "../../../queyClient";
import { getAccount } from "../../../api/accounts";

export async function loader({ params }: LoaderFunctionArgs) {
    return queryClient.fetchQuery({
        queryKey: ['accounts', 'details', params.id!],
        queryFn: getAccount(params.id!),
        staleTime: staleTimeDefault
    })
}

export default function Account() {
    const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>
    const params = useParams()
    const { data: account } = useQuery({
        queryKey: ['accounts', 'details', params.id!],
        queryFn: getAccount(params.id!),
        staleTime: staleTimeDefault,
        initialData
    })

    return (
        <>
            <div
                className="
                    min-h-12 h-12 max-h-12
                    flex justify-between items-stretch
                    divide-x dark:divide-neutral-800
                "
            >
                <h1 className="text-lg flex items-center flex-grow">{account.name}</h1>
                <Link
                    to="/accounts"
                    className="flex items-center px-4 py-1.5"
                >
                    Close
                </Link>
            </div>
        </>
    )
}