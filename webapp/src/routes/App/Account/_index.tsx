import { QueryClient } from "@tanstack/react-query";
import { LoaderFunction, LoaderFunctionArgs, Outlet } from "react-router-dom";

import Breadcrumbs from "@components/breadcrumbs";

export function loader(_queryClient: QueryClient): LoaderFunction {
    return async (_props: LoaderFunctionArgs) => {
        return { breadcrumb: "Accounts" }
    }
}

export default function Layout() {
    return (
        <div className="space-y-4">
            <div className="h-10 md:h-9 flex items-center">
                <Breadcrumbs />
            </div>
            <Outlet />
        </div>
    )
}