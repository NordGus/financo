import {
  Bookmark,
  BookMarked,
  Check,
  ChevronUp,
  Coffee,
  NotebookTabs,
  PiggyBank,
  RouteIcon,
  Settings,
  Trophy,
  User2,
  Vault
} from "lucide-react";
import { ComponentProps } from "react";
import {
  matchPath,
  NavLink,
  useLocation,
  useNavigation
} from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "./ui/sidebar";

const items = [
  {
    title: "Morning Brew",
    url: "/",
    icon: Coffee,
  },
  {
    title: "Accounts",
    url: "/accounts",
    icon: Vault,
  },
  {
    title: "Categories",
    url: "/categories",
    icon: Bookmark,
  },
  {
    title: "Ledger",
    url: "/ledger",
    icon: BookMarked,
  },
  {
    title: "Budgets",
    url: "/budgets",
    icon: NotebookTabs,
  },
  {
    title: "Payment Plans",
    url: "/payment-plans",
    icon: RouteIcon,
  },
]

const achievements = [
  {
    title: "Trophy Room",
    url: "/achievements",
    icon: Trophy,
  },
  {
    title: "Savings Goals",
    url: "/achievements",
    icon: PiggyBank,
  },
]

const footer = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { pathname: current } = useLocation()
  const { location } = useNavigation()

  const pathname = location?.pathname ?? current
  const isActive = (url: string) => matchPath(url, pathname) !== null

  return (
    <Sidebar {...props}>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(({ title, url, icon: Icon }) => (
                <SidebarMenuItem key={title}>
                  <SidebarMenuButton
                    isActive={isActive(url)}
                    asChild
                  >
                    <NavLink to={url}>
                      <Icon />
                      <span>{title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
        <SidebarGroup>
          <SidebarGroupLabel>Achievements</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {achievements.map(({ title, url, icon: Icon }) => (
                <SidebarMenuItem key={title}>
                  <SidebarMenuButton
                    isActive={isActive(url)}
                    asChild
                  >
                    <NavLink to={url}>
                      <Icon />
                      <span>{title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <SidebarMenuButton>
                  <User2 /> User
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[var(--radix-popper-anchor-width)]"
              >
                {footer.map(({ title, url, icon: Icon }) => (
                  <DropdownMenuItem key={title} asChild={true} className="cursor-pointer">
                    <NavLink to={url} className="flex items-center gap-2">
                      <Icon />
                      <span>{title}</span>
                      {isActive(url) && <span className="ml-auto"><Check /></span>}
                    </NavLink>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}