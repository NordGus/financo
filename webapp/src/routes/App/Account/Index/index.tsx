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

export function loader(_queryClient: QueryClient): LoaderFunction {
    return async (_props: LoaderFunctionArgs) => {
        return {}
    }
}

export default function Index() {
    return (
        <Tabs defaultValue={"capital"} className="flex flex-col gap-4 m-0">
            <div className="flex">
                <TabsList>
                    <TabsTrigger value="capital">Capital</TabsTrigger>
                    <TabsTrigger value="debt">Debt</TabsTrigger>
                    <TabsTrigger value="income">Income</TabsTrigger>
                    <TabsTrigger value="expenses">Expenses</TabsTrigger>
                </TabsList>
                <span className="grow contents-['']"></span>
                <Button className="gap-1" asChild={true}>
                    <Link to="/accounts/new">New</Link>
                </Button>
            </div>
            <TabsContent value="capital" className="m-0">
                <CapitalAccountsTable />
            </TabsContent>
            <TabsContent value="debt" className="m-0">
                <DebtAccountsTable />
            </TabsContent>
            <TabsContent value="income" className="m-0">
                <IncomeAccountsTable />
            </TabsContent>
            <TabsContent value="expenses" className="m-0">
                <ExpenseAccountsTable />
            </TabsContent>
        </Tabs>
    )
}