import { CreditCard, HandCoins, Landmark, PiggyBank } from "lucide-react";
import { use } from "react";
import { createSearchParams, Link, useLocation } from "react-router";
import { ListFiltersContext } from "~/modules/accounts/contexts/list-filters-context";
import { accountKindsManual } from "~/modules/accounts/manual/account-kinds-manual";
import { listFiltersToURLSearchParams } from "~/modules/accounts/types/filters";
import { Heading2, Heading3 } from "~/modules/shared/components/ui/headings";
import { Route } from "./+types/new";

export default function New({ }: Route.ComponentProps) {
  const { filters } = use(ListFiltersContext)
  const { pathname, hash } = useLocation()

  return (
    <section className="flex flex-col gap-2 overflow-y-hidden my-2 relative">
      <div className="flex flex-col gap-2 overflow-y-auto flex-1">
        <Heading2>New Account</Heading2>
        {
          !filters.kind && (
            <>
              <Heading3>
                {"What kind of Account you want to create?"}
              </Heading3>
              <Link
                className="grid grid-cols-[min-content_1fr] gap-3 border p-3 rounded-lg hover:bg-muted/50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-7 shrink-0 [&_svg]:shrink-0 shadow-xs"
                to={{
                  pathname,
                  search: createSearchParams(listFiltersToURLSearchParams({ ...filters, kind: "capital" })).toString(),
                  hash
                }}
              >
                <Landmark />
                <span className="flex flex-col gap-4">
                  <span className="text-xl font-bold">Capital</span>
                  <span className="flex flex-col gap-2 text-muted-foreground text-sm">
                    {accountKindsManual.capital.message}
                  </span>
                </span>
              </Link>
              <Link
                className="grid grid-cols-[min-content_1fr] gap-3 border p-3 rounded-lg hover:bg-muted/50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-7 shrink-0 [&_svg]:shrink-0 shadow-xs"
                to={{
                  pathname,
                  search: createSearchParams(listFiltersToURLSearchParams({ ...filters, kind: "savings" })).toString(),
                  hash
                }}
              >
                <PiggyBank />
                <span className="flex flex-col gap-4">
                  <span className="text-xl font-bold">Savings</span>
                  <span className="flex flex-col gap-2 text-muted-foreground text-sm">
                    {accountKindsManual.savings.message}
                  </span>
                </span>
              </Link>
              <Link
                className="grid grid-cols-[min-content_1fr] gap-3 border p-3 rounded-lg hover:bg-muted/50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-7 shrink-0 [&_svg]:shrink-0 shadow-xs"
                to={{
                  pathname,
                  search: createSearchParams(listFiltersToURLSearchParams({ ...filters, kind: "debt" })).toString(),
                  hash
                }}
              >
                <HandCoins />
                <span className="flex flex-col gap-4">
                  <span className="text-xl font-bold">Debt</span>
                  <span className="flex flex-col gap-2 text-muted-foreground text-sm">
                    {accountKindsManual.debt.message}
                  </span>
                </span>
              </Link>
              <Link
                className="grid grid-cols-[min-content_1fr] gap-3 border p-3 rounded-lg hover:bg-muted/50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-7 shrink-0 [&_svg]:shrink-0 shadow-xs"
                to={{
                  pathname,
                  search: createSearchParams(listFiltersToURLSearchParams({ ...filters, kind: "credit" })).toString(),
                  hash
                }}
              >
                <CreditCard />
                <span className="flex flex-col gap-4">
                  <span className="text-xl font-bold">Credit</span>
                  <span className="flex flex-col gap-2 text-muted-foreground text-sm">
                    {accountKindsManual.credit.message}
                  </span>
                </span>
              </Link>
            </>
          )
        }
      </div>
    </section>
  )
}