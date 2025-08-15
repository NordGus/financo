import {
  Bookmark,
  BookMarked,
  Check,
  ChevronUp,
  Coffee,
  LucideProps,
  PiggyBank,
  Plus,
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
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem
} from "./ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type MenuItem = {
  title: string,
  url: string,
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>,
  action?: MenuItem
}

const items: MenuItem[] = [
  {
    title: "Morning Brew",
    url: "/morning-brew",
    icon: Coffee,
  },
  {
    title: "Accounts",
    url: "/accounts",
    icon: Vault,
    action: {
      title: "New Account",
      url: "/new",
      icon: Plus
    }
  },
  {
    title: "Categories",
    url: "/categories",
    icon: Bookmark,
    action: {
      title: "New Category",
      url: "/new",
      icon: Plus
    }
  },
  {
    title: "Ledger",
    url: "/ledger",
    icon: BookMarked,
    action: {
      title: "New Transaction",
      url: "/new",
      icon: Plus
    }
  },
  // {
  //   title: "Budgets",
  //   url: "/budgets",
  //   icon: NotebookTabs,
  // },
  // {
  //   title: "Payment Plans",
  //   url: "/payment-plans",
  //   icon: Route,
  // },
]

const achievements: MenuItem[] = [
  {
    title: "Trophy Room",
    url: "/trophies",
    icon: Trophy,
  },
  {
    title: "Savings Goals",
    url: "/savings-goals",
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
  // useLocation to get the current pathname when navigation is idle.
  const staticLocation = useLocation()
  // useNavigation to get the current pathname when navigation is not idle.
  const { location: navigationLocation } = useNavigation()

  const { pathname } = navigationLocation ?? staticLocation

  // use matchPath to check if the current pathname matches the url of the item.
  // This is used to highlight the active item in the sidebar.
  const isActive = (url: string) => matchPath(url, pathname) !== null

  return (
    <Sidebar {...props}>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(({ title, url, icon: Icon, action }) => (
                <SidebarMenuItem key={title}>
                  <SidebarMenuButton
                    isActive={isActive(url)}
                    tooltip={title}
                    asChild
                  >
                    <NavLink to={url}>
                      <Icon />
                      <span>{title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                  {
                    action && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuAction asChild>
                            <NavLink to={`${url}${action.url}`}>
                              <action.icon />
                            </NavLink>
                          </SidebarMenuAction>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          {action.title}
                        </TooltipContent>
                      </Tooltip>
                    )
                  }
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
              {achievements.map(({ title, url, icon: Icon, action }) => (
                <SidebarMenuItem key={title}>
                  <SidebarMenuButton
                    isActive={isActive(url)}
                    tooltip={title}
                    asChild
                  >
                    <NavLink to={url}>
                      <Icon />
                      <span>{title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                  {
                    action && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuAction asChild>
                            <NavLink to={`${url}${action.url}`}>
                              <action.icon />
                            </NavLink>
                          </SidebarMenuAction>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          {action.title}
                        </TooltipContent>
                      </Tooltip>
                    )
                  }
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
                <SidebarMenuButton tooltip={"User"}>
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