import { Outlet } from "react-router-dom";

import NavLink from "@components/NavLink";

export default function Layout() {
    return (
        <div className='w-full h-[100dvh] grid grid-cols-[10dvw_minmax(0,_1fr)] gap-2 p-2 bg-neutral-100 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50'
        >
            <nav className='flex flex-col gap-2 h-full p-0 m-0'>
                <NavLink name="Accounts & Goals" path="accounts" />
                <NavLink name="Books" path="books" />
                <NavLink name="Budgets" path="budgets" />
                <NavLink name="Payment Plans" path="plans" />
                <NavLink name="Summary" path="summary" />
                <NavLink name="Intelligence" path="intelligence" />
            </nav>
            <div className='block h-full overflow-y-auto'>
                <Outlet />
            </div>
        </div>
    )
}