import { Outlet } from "react-router";
import { Heading1 } from "~/components/ui/headings";


export default function Layout() {
    return (
        <main className="h-full flex flex-col justify-center items-center">
            <Heading1>
                log into <span className="font-bold text-primary">financo</span>
            </Heading1>

            <Outlet />
        </main>
    )
}