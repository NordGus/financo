import {
  BookMarkedIcon,
  BookmarkIcon,
  CoffeeIcon,
  NotebookTabsIcon,
  RouteIcon,
  SettingsIcon,
  TrophyIcon,
  VaultIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigation } from "react-router";
import { Breadcrumbs } from "./components/breadcrumbs";
import { NavMenuItem } from "./components/nav-menu-item";
import { Throbber } from "./components/throbber";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from "./components/ui/drawer";
import { Toaster } from "./components/ui/sonner";

export default function Layout() {
  const location = useLocation()
  const { state: navigationState } = useNavigation()
  const [openNav, setOpenNav] = useState(false)

  useEffect(() => setOpenNav(false), [location.pathname])

  const onNavLinkClick = () => setOpenNav(false)

  return (
    <>
      <div
        className="h-full w-full overflow-hidden grid grid-cols-layout items-stretch"
      >
        <div className="flex flex-col gap-2 justify-between items-stretch bg-transparent p-4">
          <Breadcrumbs />
          <span className="grow contents-[''] h-10 col-span-2" />
          <NavMenuItem to="/morning-brew" onClick={onNavLinkClick}>
            <CoffeeIcon /> Morning Brew
          </NavMenuItem>
          <NavMenuItem to="/accounts" onClick={onNavLinkClick}>
            <VaultIcon /> Accounts
          </NavMenuItem>
          <NavMenuItem to="/categories" onClick={onNavLinkClick}>
            <BookmarkIcon /> Categories
          </NavMenuItem>
          <NavMenuItem to="/ledger" onClick={onNavLinkClick}>
            <BookMarkedIcon /> Ledger
          </NavMenuItem>
          <NavMenuItem to="/budgets" onClick={onNavLinkClick}>
            <NotebookTabsIcon /> Budgets
          </NavMenuItem>
          <NavMenuItem to="/payment-plans" onClick={onNavLinkClick}>
            <RouteIcon /> Payment plans
          </NavMenuItem>
          <span className="grow contents-[''] h-10 col-span-2" />
          <NavMenuItem to="/achievements" onClick={onNavLinkClick}>
            <TrophyIcon /> Achievements
          </NavMenuItem>
          <NavMenuItem to="/settings" onClick={onNavLinkClick}>
            <SettingsIcon /> Settings
          </NavMenuItem>
        </div>
        <main className="grow h-full overflow-hidden">
          {
            navigationState === "loading" && location.search.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <Throbber />
              </div>
            ) : <Outlet />
          }
          <Toaster position="top-center" closeButton richColors />
        </main>
      </div>

      <Drawer open={openNav} onOpenChange={setOpenNav}>
        <DrawerContent>
          <DrawerHeader className="hidden" data-hidden>
            <DrawerTitle>Navigation Menu</DrawerTitle>
            <DrawerDescription>Navigate through financo</DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </>
  )
}