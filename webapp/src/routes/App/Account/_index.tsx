import { QueryClient } from "@tanstack/react-query";
import { Link, LoaderFunction, LoaderFunctionArgs, Outlet } from "react-router-dom";

import Breadcrumbs from "@components/breadcrumbs";
import { Button } from "@components/ui/button";

export function loader(_queryClient: QueryClient): LoaderFunction {
    return async (_props: LoaderFunctionArgs) => {
        return { breadcrumb: "Accounts" }
    }
}

export default function Layout() {
    return (
        <div className="gap-4 flex flex-col">
            <div className="flex items-center">
                <Breadcrumbs />
                <span className="grow contents-['']"></span>
                <Button asChild={true}>
                    <Link to="/accounts/new">New Account</Link>
                </Button>
            </div>
            <Outlet />
        </div>
    )
}