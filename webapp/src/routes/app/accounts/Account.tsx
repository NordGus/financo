import { Link, LoaderFunctionArgs, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { queryClient, staleTimeDefault } from "../../../queyClient";
import { getAccount } from "../../../api/accounts";

import Throbber from "../../../components/Throbber";

export async function loader({ params: { id } }: LoaderFunctionArgs) {
    return queryClient.fetchQuery({
        queryKey: ['accounts', 'details', id!],
        queryFn: getAccount(id!),
        staleTime: staleTimeDefault
    })
}

export default function Account() {
    const { id: paramsID } = useParams()
    const accountQuery = useQuery({
        queryKey: ['accounts', 'details', paramsID!],
        queryFn: getAccount(paramsID!),
        staleTime: staleTimeDefault
    })

    if (accountQuery.isFetching) {
        return (
            <div className="h-[30dvh] flex justify-center items-center">
                <Throbber variant="big" />
            </div>
        )
    }

    const { name } = accountQuery.data!

    return (
        <>
            <div
                className="min-h-12 h-12 max-h-12 flex justify-between items-stretch divide-x dark:divide-neutral-800"
            >
                <h1 className="text-lg flex items-center flex-grow">{name}</h1>
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