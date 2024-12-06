import {
  BookMarkedIcon,
  LayoutDashboardIcon,
  NotebookTabsIcon,
  RouteIcon,
  SettingsIcon,
  TrophyIcon,
  VaultIcon,
} from "lucide-react";
import { Outlet } from "react-router";
import { Breadcrumbs } from "./components/breadcrumbs";
import { NavItem } from "./components/nav-item";
import { Toaster } from "./components/ui/sonner";

export default function Layout() {
  return (
    <div
      className="h-full w-full overflow-hidden grid grid-cols-layout items-stretch gap-4"
    >
      <main
        className="grow h-full overflow-y-auto overflow-x-auto py-4 pl-4"
      >
        <Breadcrumbs />
        <Outlet />
        <Toaster position="top-center" closeButton />
      </main>
      <nav className="flex flex-col gap-4 p-4 justify-stretch items-start">
        <NavItem to="/dashboard">
          <LayoutDashboardIcon /> Dashboard
        </NavItem>
        <NavItem to="/accounts">
          <VaultIcon /> Accounts
        </NavItem>
        <NavItem to="/ledger">
          <BookMarkedIcon /> Ledger
        </NavItem>
        <NavItem to="/budgets">
          <NotebookTabsIcon /> Budgets
        </NavItem>
        <NavItem to="/payment-plans">
          <RouteIcon /> Payment plans
        </NavItem>
        <span className="grow contents-['']"></span>
        <NavItem to="/achievements">
          <TrophyIcon /> Achievements
        </NavItem>
        <NavItem to="/settings">
          <SettingsIcon /> Settings
        </NavItem>
      </nav>
    </div>
  )
}