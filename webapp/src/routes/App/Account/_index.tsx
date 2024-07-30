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
        <div className="gap-4 grid grid-rows-[min-content_1fr] grid-cols-3 h-full">
            <div className="flex items-center col-span-3 pt-2">
                <Breadcrumbs />
            </div>
            <Outlet />
        </div>
    )
}