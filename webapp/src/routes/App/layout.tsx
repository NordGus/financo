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
import { Toaster } from "@components/ui/toaster";

export default function Layout() {
    return (
        <div className='w-full h-[100dvh] grid grid-cols-[min-content_1fr] dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 items-stretch'
        >
            <nav className='flex flex-col gap-2 p-2 h-full m-0 border-r border-zinc-200 dark:border-zinc-800 bg-transparent shadow-sm'>
                <NavLink
                    name="Dashboard"
                    path=""
                    icon={<ChartCandlestickIcon className="w-[1.75rem] h-[1.75rem]" />}
                />
                <NavLink
                    name="Accounts"
                    path="accounts"
                    icon={<VaultIcon className="w-[1.75rem] h-[1.75rem]" />}
                />
                <NavLink
                    name="Ledger"
                    path="books"
                    icon={<BookMarkedIcon className="w-[1.75rem] h-[1.75rem]" />}
                />
                <NavLink
                    name="Budgets"
                    path="budgets"
                    icon={<NotebookTabsIcon className="w-[1.75rem] h-[1.75rem]" />}
                />
                <NavLink
                    name="Payment Plans"
                    path="plans"
                    icon={<RouteIcon className="w-[1.75rem] h-[1.75rem]" />}
                />
                <NavLink
                    name="Savings Goals"
                    path="goals"
                    icon={<GoalIcon className="w-[1.75rem] h-[1.75rem]" />}
                />
                <span className="grow contents-['']"></span>
                <NavLink
                    name="Achievements"
                    path="achievements"
                    icon={<TrophyIcon className="w-[1.75rem] h-[1.75rem]" />}
                />
                <NavLink
                    name="Configuration"
                    path="settings"
                    icon={<SettingsIcon className="w-[1.75rem] h-[1.75rem]" />}
                />
            </nav>
            <main className='overflow-y-auto p-2'>
                <Outlet />
                <Toaster />
            </main>
        </div>
    )
}