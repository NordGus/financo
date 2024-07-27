import { Outlet } from "react-router-dom";
import {
    BookMarkedIcon,
    ChartCandlestickIcon,
    GoalIcon,
    NotebookTabsIcon,
    RouteIcon,
    SettingsIcon,
    TrophyIcon,
    VaultIcon
} from "lucide-react";

import NavLink from "@components/NavLink";

export default function Layout() {
    return (
        <div className='w-full h-[100dvh] grid grid-cols-[min-content_minmax(0,_1fr)] dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50'
        >
            <nav className='flex flex-col gap-2 p-2 h-full m-0 border-r border-zinc-200 dark:border-zinc-800 bg-transparent shadow-sm'>
                <NavLink name="Dashboard" path="" icon={<ChartCandlestickIcon />} />
                <NavLink name="Accounts" path="accounts" icon={<VaultIcon />} />
                <NavLink name="Ledger" path="books" icon={<BookMarkedIcon />} />
                <NavLink name="Budgets" path="budgets" icon={<NotebookTabsIcon />} />
                <NavLink name="Payment Plans" path="plans" icon={<RouteIcon />} />
                <NavLink name="Savings Goals" path="goals" icon={<GoalIcon />} />
                <span className="grow contents-['']"></span>
                <NavLink name="Achievements" path="achievements" icon={<TrophyIcon />} />
                <NavLink name="Configuration" path="settings" icon={<SettingsIcon />} />
            </nav>
            <main className='block min-h-full overflow-y-auto p-2'>
                <Outlet />
            </main>
        </div>
    )
}