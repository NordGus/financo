import { QueryClient } from "@tanstack/react-query";
import { LoaderFunction, LoaderFunctionArgs, Outlet } from "react-router-dom";

import Breadcrumbs from "@components/breadcrumbs";
import { AchievementsTracker } from "./Index/achievements";
import { SummaryCapital, SummaryDebt, SummaryNetWorth, SummaryAvailableCredit } from "./Index/summaries";

export function loader(_queryClient: QueryClient): LoaderFunction {
    return async (_props: LoaderFunctionArgs) => {
        return { breadcrumb: "Accounts" }
    }
}

export default function Layout() {
    return (
        <main className="space-y-4">
            <div className="h-10 md:h-9 flex items-center">
                <Breadcrumbs />
            </div>
            <div className="grid grid-cols-3 gap-4 items-start">
                <div className="grid grid-cols-2 gap-4">
                    <SummaryCapital />
                    <SummaryDebt />
                    <SummaryNetWorth />
                    <SummaryAvailableCredit />
                    <AchievementsTracker className="col-span-2" />
                </div>
                <div className="col-span-2">
                    <Outlet />
                </div>
            </div>
        </main>
    )
}