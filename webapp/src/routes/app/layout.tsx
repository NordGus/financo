import NavLink from "@components/NavLink";
import { Toaster } from "@components/ui/toaster";
import {
    BookMarkedIcon,
    ChartCandlestickIcon,
    NotebookTabsIcon,
    RouteIcon,
    SettingsIcon,
    TrophyIcon,
    VaultIcon
} from "lucide-react";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className='w-full h-[100dvh] grid grid-cols-[min-content_1fr] items-stretch'>
            <nav className='flex flex-col gap-4 p-4 h-full m-0 border-r border-zinc-200 dark:border-zinc-800  bg-transparent shadow-sm'>
                <NavLink
                    name="Dashboard"
                    path=""
                    icon={<ChartCandlestickIcon />}
                />
                <NavLink
                    name="Accounts"
                    path="accounts"
                    icon={<VaultIcon />}
                />
                <NavLink
                    name="Ledger"
                    path="ledger"
                    icon={<BookMarkedIcon />}
                />
                <NavLink
                    name="Budgets"
                    path="budgets"
                    icon={<NotebookTabsIcon />}
                />
                <NavLink
                    name="Payment Plans"
                    path="payment-plans"
                    icon={<RouteIcon />}
                />
                <span className="grow contents-['']"></span>
                <NavLink
                    name="Achievements"
                    path="achievements"
                    icon={<TrophyIcon />}
                />
                <NavLink
                    name="Configuration"
                    path="settings"
                    icon={<SettingsIcon />}
                />
            </nav>
            <main className='overflow-y-auto p-4'>
                <Outlet />
                <Toaster />
            </main>
        </div>
    )
}