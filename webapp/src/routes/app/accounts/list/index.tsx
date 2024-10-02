import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@components/ui/accordion";
import { Card, CardContent, CardDescription } from "@components/ui/card";
import {
    SummaryAvailableCredit,
    SummaryCapital,
    SummaryDebt,
    SummaryNetWorth
} from "@components/widgets/summaries";
import {
    CapitalAccountsTable,
    DebtAccountsTable,
    ExpenseAccountsTable,
    IncomeAccountsTable
} from "./accounts";

export default function Index() {
    return (
        <>
            <div className="grid grid-cols-4 gap-4 items-stretch">
                <SummaryCapital className="grow" key="summary:capital" />
                <SummaryDebt className="grow" key="summary:debt" />
                <SummaryNetWorth className="grow" key="summary:netWorth" />
                <SummaryAvailableCredit className="grow" key="summary:availableCredit" />
            </div>
            <Card className="overflow-clip">
                <Accordion type="single" defaultValue={"capital"} collapsible>
                    <AccordionItem value="capital">
                        <AccordionTrigger className="px-6">Capital and Savings</AccordionTrigger>
                        <AccordionContent>
                            <CardContent>
                                <CardDescription>
                                    Represents your bank account, cash or savings accounts
                                </CardDescription>
                            </CardContent>
                            <CapitalAccountsTable />
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="debt">
                        <AccordionTrigger className="px-6">Debts and Credit Lines</AccordionTrigger>
                        <AccordionContent>
                            <CardContent>
                                <CardDescription>
                                    Represent loans of any kind, debts between you and your friends or any kind of credit line, like credit cards
                                </CardDescription>
                            </CardContent>
                            <DebtAccountsTable />
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="income">
                        <AccordionTrigger className="px-6">Income Sources and Incoming Transactions</AccordionTrigger>
                        <AccordionContent>
                            <CardContent>
                                <CardDescription>
                                    Represent any possible incoming source of currency
                                </CardDescription>
                            </CardContent>
                            <IncomeAccountsTable />
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="expenses" className="border-none">
                        <AccordionTrigger className="px-6">Expenses and Outgoing Transactions</AccordionTrigger>
                        <AccordionContent>
                            <CardContent>
                                <CardDescription>
                                    Represent any possible incoming source of currency
                                </CardDescription>
                            </CardContent>
                            <ExpenseAccountsTable />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </Card>
        </>
    )
}