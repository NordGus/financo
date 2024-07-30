import { Link, LoaderFunction, LoaderFunctionArgs } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";

import { Button } from "@components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import {
    CapitalAccountsTable,
    DebtAccountsTable,
    ExpenseAccountsTable,
    IncomeAccountsTable
} from "./accounts";
import { GoalsTracker } from "@components/widgets/goals";
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
            <div className="flex flex-col gap-4 h-full items-stretch overflow-y-hidden">
                <div className="grid grid-cols-2 gap-4 items-stretch grow">
                    <SummaryCapital />
                    <SummaryDebt />
                    <SummaryNetWorth />
                    <SummaryAvailableCredit />
                </div>
                <GoalsTracker className="col-span-2 h-[65dvh]" />
            </div>
            <Tabs
                defaultValue={"capital"}
                className="flex flex-col gap-4 m-0 col-span-2 h-full overflow-y-auto"
            >
                <div className="flex sticky top-0 z-20">
                    <TabsList className="shadow-md">
                        <TabsTrigger value="capital">Capital</TabsTrigger>
                        <TabsTrigger value="debt">Debt</TabsTrigger>
                        <TabsTrigger value="income">Income</TabsTrigger>
                        <TabsTrigger value="expenses">Expenses</TabsTrigger>
                    </TabsList>
                    <span className="grow contents-['']"></span>
                    <Button asChild={true}>
                        <Link to="/accounts/new" className="shadow-lg">New</Link>
                    </Button>
                </div>
                <div className="grow flex flex-col">
                    <TabsContent value="capital" className="m-0 grow">
                        <CapitalAccountsTable />
                    </TabsContent>
                    <TabsContent value="debt" className="m-0 grow">
                        <DebtAccountsTable />
                    </TabsContent>
                    <TabsContent value="income" className="m-0 grow">
                        <IncomeAccountsTable />
                    </TabsContent>
                    <TabsContent value="expenses" className="m-0 grow">
                        <ExpenseAccountsTable />
                    </TabsContent>
                </div>
            </Tabs>
        </>
    )
}