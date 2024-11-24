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
import { NavItem } from "./components/nav-item";

export default function Layout() {
  return (
    <div
      className="h-full w-full overflow-hidden grid grid-cols-layout items-stretch"
    >
      <main
        className="grow h-full overflow-y-auto overflow-x-auto p-2"
      >
        <Outlet />
      </main>
      <nav className="flex flex-col gap-1 p-2 justify-stretch items-start">
        <NavItem to="/">
          <LayoutDashboardIcon /> dashboard
        </NavItem>
        <NavItem to="/accounts">
          <VaultIcon /> accounts
        </NavItem>
        <NavItem to="/ledger">
          <BookMarkedIcon /> ledger
        </NavItem>
        <NavItem to="/budgets">
          <NotebookTabsIcon /> budgets
        </NavItem>
        <NavItem to="/payment-plans">
          <RouteIcon /> payment plans
        </NavItem>
        <span className="grow contents-['']"></span>
        <NavItem to="/achievements">
          <TrophyIcon /> achievements
        </NavItem>
        <NavItem to="/settings">
          <SettingsIcon /> settings
        </NavItem>
      </nav>
    </div>
  )
}