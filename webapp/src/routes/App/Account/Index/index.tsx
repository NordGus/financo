import { LoaderFunction, LoaderFunctionArgs } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";

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
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@components/ui/accordion";

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
            <Accordion type="single" defaultValue={"capital"} collapsible>
                <AccordionItem value="capital">
                    <AccordionTrigger>Capital</AccordionTrigger>
                    <AccordionContent>
                        <CapitalAccountsTable />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="debt">
                    <AccordionTrigger>Debts and Credit Lines</AccordionTrigger>
                    <AccordionContent>
                        <DebtAccountsTable />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="income">
                    <AccordionTrigger>Income Sources and Incoming Transactions</AccordionTrigger>
                    <AccordionContent>
                        <IncomeAccountsTable />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="expenses">
                    <AccordionTrigger>Expenses and Outgoing Transactions</AccordionTrigger>
                    <AccordionContent>
                        <ExpenseAccountsTable />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </>
    )
}