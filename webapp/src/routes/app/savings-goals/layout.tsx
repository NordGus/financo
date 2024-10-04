import { Goal } from "@/types/Goal";
import Breadcrumbs from "@components/breadcrumbs";
import { Button } from "@components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@components/ui/sheet";
import { isEqual } from "lodash";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Goals from "./goal";

export default function Layout() {
    const [openForm, setOpenForm] = useState(false)
    const [goal, setGoal] = useState<Goal | NonNullable<unknown>>({})

    return (
        <div className="gap-4 flex flex-col">
            <div className="flex items-center gap-4">
                <Breadcrumbs />
                <span className="grow contents-['']"></span>
                <Button onClick={() => { setGoal({}); setOpenForm(true); }}>New</Button>
            </div>
            <Sheet open={openForm} onOpenChange={setOpenForm}>
                <SheetContent className="w-[400px] sm:w-[540px] sm:max-w-[540px] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>
                            {
                                isEqual(goal, {})
                                    ? "Add Goal"
                                    : "Edit Goal"
                            }
                        </SheetTitle>
                    </SheetHeader>
                    <Goals.Form goal={goal} setOpen={setOpenForm} />
                </SheetContent>
            </Sheet>
            <Outlet
                context={{
                    setGoal,
                    setOpen: setOpenForm
                }}
            />
        </div>
    )
}