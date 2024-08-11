import Breadcrumbs from "@components/breadcrumbs";
import { Button } from "@components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@components/ui/sheet";
import { QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { LoaderFunction, LoaderFunctionArgs, Outlet } from "react-router-dom";

export function loader(_queryClient: QueryClient): LoaderFunction {
    return async (_props: LoaderFunctionArgs) => {
        return { breadcrumb: "Ledger" }
    }
}

export default function Layout() {
    const [openSheet, setOpenSheet] = useState(false)
    // const [filters, setFilters] = useState<ListFilters>(defaultFilters())

    // const transactionHistory = useMutation({
    //     mutationFn: (filters: ListFilters) => getTransactions(filters)()
    // })

    // useEffect(() => transactionHistory.mutate(filters), [])

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
                            <SheetTitle>Add Transaction</SheetTitle>
                        </SheetHeader>
                        <span>Place Holder</span>
                    </SheetContent>
                </Sheet>
            </div>
            <Outlet />
        </div>
    )
}