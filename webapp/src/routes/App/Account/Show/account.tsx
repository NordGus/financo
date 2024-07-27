import Detailed from "@/types/Account";

import { Throbber } from "@components/Throbber";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";

function AccountBaseDetails({
    account, loading
}: {
    account: Detailed,
    loading: boolean
}) {
    return <Card>
        <CardHeader className="flex flex-row justify-between items-start">
            <div>
                <CardTitle>Details</CardTitle>
                <CardDescription>
                    Account information and configuration
                </CardDescription>
            </div>
            {loading && <Throbber variant="small" />}
        </CardHeader>
        <CardContent>
            <p>{account.name}</p>
        </CardContent>
    </Card>
}

export function AccountDetails({ account, loading }: { account: Detailed, loading: boolean }) {
    return (
        <>
            <AccountBaseDetails account={account} loading={loading} />
        </>
    )
}