import { LoaderFunction, LoaderFunctionArgs } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import {
    CapitalAccountsTable,
    DebtAccountsTable,
    ExpenseAccountsTable,
    IncomeAccountsTable
} from "./accounts";
import {
    SummaryCapital,
    SummaryDebt,
    SummaryNetWorth,
    SummaryAvailableCredit
} from "@components/widgets/summaries";

export function loader(_queryClient: QueryClient): LoaderFunction {
    return async (_props: LoaderFunctionArgs) => {
        return {}
    }
}

export default function Index() {
    return (
        <>
            <div className="grid grid-cols-4 gap-4 h-[20dvh] items-stretch">
                <SummaryCapital className="grow" />
                <SummaryDebt className="grow" />
                <SummaryNetWorth className="grow" />
                <SummaryAvailableCredit className="grow" />
            </div>
            <Tabs defaultValue={"mine"}>
                <div className="sticky top-0 mb-4 z-20">
                    <TabsList className="shadow-md">
                        <TabsTrigger value="mine">Mine</TabsTrigger>
                        <TabsTrigger value="external">External</TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="mine" className="flex flex-col gap-4 m-0">
                    <CapitalAccountsTable />
                    <DebtAccountsTable />
                </TabsContent>
                <TabsContent value="external" className="flex flex-col gap-4 m-0">
                    <IncomeAccountsTable />
                    <ExpenseAccountsTable />
                </TabsContent>
            </Tabs>
        </>
    )
}