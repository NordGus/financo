import { QueryClient } from "@tanstack/react-query";
import { LoaderFunction, LoaderFunctionArgs } from "react-router-dom";
import { SummaryAvailableCredit, SummaryCapital, SummaryDebt, SummaryNetWorth } from "./summaries";

export function loader(_queryClient: QueryClient): LoaderFunction {
    return async (_props: LoaderFunctionArgs) => {
        return {}
    }
}

export default function Index() {
    return (
        <>
            <div className="grid gap-2 grid-cols-4">
                <SummaryCapital />
                <SummaryDebt />
                <SummaryNetWorth />
                <SummaryAvailableCredit />
            </div>
        </>
    )
}