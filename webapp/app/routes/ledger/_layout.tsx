import { Plus } from "lucide-react";
import { Outlet } from "react-router";
import { list as listAccountsQuery } from "~/modules/ledger/api/queries/accounts/list";
import { getFilters } from "~/modules/ledger/utils/router-requests";
import { ToolBar } from "~/modules/shared/components/tool-bar";
import { Button } from "~/modules/shared/components/ui/button";
import { Route } from "./+types/_layout";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "financo - Ledger" },
    { name: "description", content: "Manage the Transactions between your Accounts" }
  ]
}

export async function clientLoader({ request }: Route.LoaderArgs) {
  const filters = getFilters(request)
  const accounts = await listAccountsQuery()

  return {
    breadcrumb: "Ledger",
    accounts,
    filters
  }
}

export default function Layout({ }: Route.ComponentProps) {
  return (
    <>
      <ToolBar>
        <Button variant={"secondary"}>
          Filter Date
        </Button>
        <Button variant={"secondary"}>
          Filter Accounts
        </Button>
        <Button variant={"secondary"}>
          Filter categories
        </Button>
        <Button size={"icon"}>
          <Plus />
        </Button>
      </ToolBar>
      <div className="grow overflow-hidden no-scrollbar grid grid-cols-2 gap-4 px-4">
        <Outlet />
      </div>
    </>
  )
}
