import { UseMutationResult } from "@tanstack/react-query";

import Detailed from "@/types/Account";

import { Throbber } from "@components/Throbber";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";

export function AccountBaseDetails({
    account, isFetching, mutation
}: {
    account: Detailed,
    isFetching: boolean,
    mutation: UseMutationResult<Detailed[], Error, Detailed, unknown>
}) {
    return <Card>
        <CardHeader className="flex flex-row justify-between items-start">
            <div>
                <CardTitle>Details</CardTitle>
                <CardDescription>
                    Account information and configuration
                </CardDescription>
            </div>
            {isFetching || mutation.isPending && <Throbber variant="small" />}
            {
                !mutation.isPending && <Button onClick={() => mutation.mutate(account)}>
                    Save
                </Button>
            }
        </CardHeader>
        <CardContent>
            <p>{account.name}</p>
        </CardContent>
    </Card>
}