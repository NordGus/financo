import { QueryClient } from "@tanstack/react-query";
import { Link, LoaderFunction, LoaderFunctionArgs } from "react-router-dom";
import { SummaryAvailableCredit, SummaryCapital, SummaryDebt, SummaryNetWorth } from "./summaries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Button } from "@components/ui/button";
import { Plus } from "lucide-react";

export function loader(_queryClient: QueryClient): LoaderFunction {
    return async (_props: LoaderFunctionArgs) => {
        return {}
    }
}

export default function Index() {
    return (
        <div className="flex flex-col gap-2">
            <div className="grid gap-2 grid-cols-4">
                <SummaryCapital />
                <SummaryDebt />
                <SummaryNetWorth />
                <SummaryAvailableCredit />
            </div>
            <Tabs defaultValue={"capital"} className="flex flex-col gap-2">
                <div className="flex">
                    <TabsList>
                        <TabsTrigger value="capital">Capital</TabsTrigger>
                        <TabsTrigger value="debt">Debt</TabsTrigger>
                        <TabsTrigger value="income">Income</TabsTrigger>
                        <TabsTrigger value="expenses">Expenses</TabsTrigger>
                    </TabsList>
                    <span className="grow contents-['']"></span>
                    <Button className="gap-1" asChild={true}>
                        <Link to="/accounts/new">
                            <Plus className="h-4 w-4" />
                            <span className="sr-only sm:not-sr-only">New</span>
                        </Link>
                    </Button>
                </div>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <TabsContent value="capital">
                            <CardTitle>Capital</CardTitle>
                            <CardDescription>
                                Recent orders from your store.
                            </CardDescription>
                        </TabsContent>
                        <TabsContent value="debt">
                            <CardTitle>Debts and Credit Lines</CardTitle>
                            <CardDescription>
                                Recent orders from your store.
                            </CardDescription>
                        </TabsContent>
                        <TabsContent value="income">
                            <CardTitle>Income Sources</CardTitle>
                            <CardDescription>
                                Recent orders from your store.
                            </CardDescription>
                        </TabsContent>
                        <TabsContent value="expenses">
                            <CardTitle>Expenses</CardTitle>
                            <CardDescription>
                                Recent orders from your store.
                            </CardDescription>
                        </TabsContent>
                    </CardHeader>
                    <CardContent>
                        <TabsContent value="capital">
                            <h1>capital</h1>
                        </TabsContent>
                        <TabsContent value="debt">
                            <h1>debt</h1>
                        </TabsContent>
                        <TabsContent value="income">
                            <h1>income</h1>
                        </TabsContent>
                        <TabsContent value="expenses">
                            <h1>expenses</h1>
                        </TabsContent>
                    </CardContent>
                </Card>
            </Tabs>
        </div>
    )
}