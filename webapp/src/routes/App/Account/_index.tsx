import { useState } from "react";
import { QueryClient } from "@tanstack/react-query";
import { LoaderFunction, LoaderFunctionArgs, Outlet } from "react-router-dom";

import Breadcrumbs from "@components/breadcrumbs";
import { Button } from "@components/ui/button";
import { cn } from "@/lib/utils";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@components/ui/sheet";
import { NewAccountForm } from "./New";

export function loader(_queryClient: QueryClient): LoaderFunction {
    return async (_props: LoaderFunctionArgs) => {
        return { breadcrumb: "Accounts" }
    }
}

export default function Layout() {
    const [openSheet, setOpenSheet] = useState(false)

    return (
        <div className="gap-4 flex flex-col">
            <div className="flex items-center">
                <Breadcrumbs />
                <span className="grow contents-['']"></span>
                <Sheet open={openSheet} onOpenChange={setOpenSheet}>
                    <SheetTrigger asChild={true}>
                        <Button>Add Account</Button>
                    </SheetTrigger>
                    <SheetContent className="w-[400px] sm:w-[540px] sm:max-w-[540px]">
                        <SheetHeader>
                            <SheetTitle>Add Account</SheetTitle>
                            <SheetDescription>
                                Please enter the base details for the new account
                            </SheetDescription>
                        </SheetHeader>
                        <NewAccountForm setOpen={setOpenSheet} />
                    </SheetContent>
                </Sheet>
            </div>
            <Outlet />
        </div>
    )
}