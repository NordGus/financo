import { QueryClient } from "@tanstack/react-query";
import { Link, LoaderFunction, LoaderFunctionArgs, Outlet, useMatch } from "react-router-dom";

import Breadcrumbs from "@components/breadcrumbs";
import { Button } from "@components/ui/button";
import { cn } from "@/lib/utils";

export function loader(_queryClient: QueryClient): LoaderFunction {
    return async (_props: LoaderFunctionArgs) => {
        return { breadcrumb: "Accounts" }
    }
}

export default function Layout() {
    const match = useMatch("/accounts/new")

    return (
        <div className="gap-4 flex flex-col">
            <div className="flex items-center">
                <Breadcrumbs />
                <span className="grow contents-['']"></span>
                <Button asChild={true}>
                    <Link
                        to="/accounts/new"
                        className={cn(match && "pointer-events-none opacity-0")}
                    >
                        New Account
                    </Link>
                </Button>
            </div>
            <Outlet />
        </div>
    )
}