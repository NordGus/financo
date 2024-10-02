import Breadcrumbs from "@components/breadcrumbs";
import { Button } from "@components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@components/ui/sheet";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { NewAccountForm } from "./New";

export default function Layout() {
    const [openSheet, setOpenSheet] = useState(false)

    return (
        <div className="gap-4 flex flex-col">
            <div className="flex items-center">
                <Breadcrumbs />
                <span className="grow contents-['']"></span>
                <Sheet open={openSheet} onOpenChange={setOpenSheet}>
                    <SheetTrigger asChild={true}>
                        <Button>New</Button>
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