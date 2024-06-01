import { Link, LoaderFunctionArgs, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { queryClient, staleTimeDefault } from "../../../queyClient";
import { getAccount } from "@api/accounts";
import { Kind } from "@/types/Account";

import Panel from "@components/Panel";

function translateAccountKind(kind: Kind) {
    switch (kind) {
        case Kind.CapitalNormal:
            return "Bank Account"
        case Kind.CapitalSavings:
            return "Savings"
        case Kind.DebtCredit:
            return "Credit"
        case Kind.DebtLoan:
            return "Loan"
        case Kind.DebtPersonal:
            return "Personal Loan"
        case Kind.ExternalIncome:
            return "Income"
        case Kind.ExternalExpense:
            return "Expense"
        default:
            throw new Error(`invalid kind: ${kind}`);
    }
}

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

    return (
        <Panel
            header={<>
                {
                    accountQuery.isFetched && <span className="flex items-center px-4">
                        {translateAccountKind(accountQuery.data!.kind)}
                    </span>
                }
                <span className="flex-grow content-['']"></span>
                <Link
                    to="/accounts"
                    className="flex items-center px-4 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                    Close
                </Link>
            </>}
            className="max-h-[95dvh] min-h-[30dvh]"
            loading={accountQuery.isFetching}
        >

        </Panel>
    )
}