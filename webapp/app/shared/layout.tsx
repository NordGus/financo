import { LayoutDashboardIcon, VaultIcon } from "lucide-react";
import { Outlet } from "react-router";
import { NavItem } from "./components/nav-item";

export default function Layout() {
  return (
    <div
      className="h-full w-full overflow-hidden grid grid-cols-layout items-stretch"
    >
      <nav className="flex flex-col gap-1 p-2 justify-stretch items-start">
        <NavItem to="/">
          <LayoutDashboardIcon /> dashboard
        </NavItem>
        <NavItem to="/accounts">
          <VaultIcon /> accounts
        </NavItem>
      </nav>
      <main
        className="grow h-full overflow-y-auto overflow-x-auto p-2"
      >
        <Outlet />
      </main>
    </div>
  )
}