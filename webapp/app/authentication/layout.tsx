import { Outlet } from "react-router";
import { Heading1 } from "~/components/ui/headings";
import { cn } from "~/lib/utils";


export default function Layout() {
    return (
        <main
            className={cn(
                "h-full",
                "grid grid-cols-2 justify-center items-center gap-base",
                "overflow-hidden"
            )}
        >
            <div
                className={cn(
                    "h-full",
                    "flex flex-col items-center justify-center",
                    "border-r",
                    "overflow-hidden"
                )}
            >
                <Heading1 className="text-center">
                    log into <span className="font-bold text-primary">financo</span>
                </Heading1>
            </div>

            <div
                className={cn(
                    "grow h-full",
                    "flex flex-col gap-base justify-center items-center",
                    "overflow-x-hidden overflow-y-auto"
                )}
            >
                <Outlet />
            </div>
        </main>
    )
}