import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { staleTimeDefault } from "@/queries/Client";
import { getAccount } from "@api/accounts";
import { Kind } from "@/types/Account";

import Panel from "@components/Panel";

function translateAccountKind(kind: Kind) {
    return {
        [Kind.CapitalNormal]: "Bank Account",
        [Kind.CapitalSavings]: "Savings",
        [Kind.DebtCredit]: "Credit",
        [Kind.DebtLoan]: "Loan",
        [Kind.DebtPersonal]: "Personal Loan",
        [Kind.ExternalIncome]: "Income",
        [Kind.ExternalExpense]: "Expense"
    }[kind]
}

function accountQueryBuilder(id: string) {
    return {
        queryKey: ['accounts', 'details', id],
        queryFn: getAccount(id),
        staleTime: staleTimeDefault
    }
}

export default function Account() {
    const { id: paramsID } = useParams()
    const accountQueryOptions = useMemo(() => accountQueryBuilder(paramsID!), [paramsID])
    const accountQuery = useQuery(accountQueryOptions)

    return (
        <Panel.Base
            className="max-h-[95dvh] min-h-[30dvh]"
            loading={accountQuery.isFetching}
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
        />
    )
}