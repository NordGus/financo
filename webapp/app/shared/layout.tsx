import {
  BookMarkedIcon,
  BookmarkIcon,
  CoffeeIcon,
  MenuIcon,
  NotebookTabsIcon,
  RouteIcon,
  SettingsIcon,
  TrophyIcon,
  VaultIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { Breadcrumbs } from "./components/breadcrumbs";
import { NavItem } from "./components/nav-item";
import { Button } from "./components/ui/button";
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
  const [openNav, setOpenNav] = useState(false)

  useEffect(() => setOpenNav(false), [location.pathname])

  return (
    <>
      <div
        className="h-full w-full overflow-hidden grid grid-rows-layout items-stretch"
      >
        <main className="grow h-full overflow-y-auto overflow-x-auto p-4">
          <Outlet />
          <Toaster position="top-center" closeButton richColors />
        </main>
        <div className="flex justify-between items-center p-4 bg-transparent border-t">
          <Breadcrumbs />
          <Button onClick={() => setOpenNav(true)} variant={"link"}>
            <MenuIcon /> <span className="hidden md:inline-block">Menu</span>
          </Button>
        </div>
      </div>
      <Drawer open={openNav} onOpenChange={setOpenNav}>
        <DrawerContent>
          <DrawerHeader className="hidden" data-hidden>
            <DrawerTitle>Navigation Menu</DrawerTitle>
            <DrawerDescription>Navigate through financo</DrawerDescription>
          </DrawerHeader>
          <nav className="grid grid-cols-2 gap-2 p-4">
            <NavItem to="/morning-brew">
              <CoffeeIcon /> Morning Brew
            </NavItem>
            <NavItem to="/accounts">
              <VaultIcon /> Accounts
            </NavItem>
            <NavItem to="/categories">
              <BookmarkIcon /> Categories
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
            <span className="grow contents-[''] h-10 col-span-2" />
            <NavItem to="/achievements">
              <TrophyIcon /> Achievements
            </NavItem>
            <NavItem to="/settings">
              <SettingsIcon /> Settings
            </NavItem>
          </nav>
        </DrawerContent>
      </Drawer>
    </>
  )
}