import { format } from "date-fns";
import { useRef } from "react";
import { useLocation, useNavigation } from "react-router";
import { cn } from "~/lib/utils";
import { AccountsContextProvider } from "~/modules/ledger/contexts/accounts-context";
import { FullScreenThrobber } from "~/modules/shared/components/throbber";
import { CurrenciesContextProvider } from "~/modules/shared/contexts/currencies-context";
import { Route } from "./+types/new";

export function clientLoader({ }: Route.ClientLoaderArgs) {
  return { breadcrumb: "Edit Transaction" }
}

export default function Edit({ matches }: Route.ComponentProps) {
  // extracting data from webapp/app/modules/shared/layout.tsx's loader.
  const { data: { currencies } } = matches[1]
  // extracting data from webapp/app/routes/ledger/_layout.tsx's loader.
  const { data: { accounts, accountsMap } } = matches[2]

  const { pathname } = useLocation() // current location
  const { state: navigationState, location } = useNavigation() // navigation location

  const today = useRef<Date>(new Date())


  return (
    <CurrenciesContextProvider currencies={currencies}>
      <AccountsContextProvider accounts={accounts} accountsMap={accountsMap}>
        <section className="grid grid-cols-2 grid-rows-[0.75fr_1fr_0.5fr_min-content_0.75fr_min-content] h-full max-h-full py-4 gap-2 overflow-y-auto no-scrollbar relative">
          <FullScreenThrobber
            className={cn(
              "absolute inset-0 z-50",
              (navigationState === "idle" || location.pathname === pathname) && "hidden"
            )}
          />
          <div className="rounded-lg border">
            From account
          </div>
          <div className="rounded-lg border">
            To account
          </div>
          <div className="rounded-lg bg-zinc-700">
            Source amount
          </div>
          <div className="rounded-lg bg-zinc-700">
            Target amount
          </div>
          <div className="rounded-lg border">
            Issued {format(today.current, "LLL dd, y")}
          </div>
          <div className="rounded-lg border">
            Effective {format(today.current, "LLL dd, y")}
          </div>
          <div className="col-span-2">
            Date controls
          </div>
          <div className="rounded-lg border col-span-2">
            Notes
          </div>

          <div className="grid col-span-2 grid-cols-5 grid-rows-4 gap-2 mx-auto w-full max-w-[45dvh]">
            <div className="rounded-lg border aspect-square">div</div>
            <div className="rounded-lg border aspect-square">7</div>
            <div className="rounded-lg border aspect-square">8</div>
            <div className="rounded-lg border aspect-square">9</div>
            <div className="rounded-lg border aspect-square">back</div>
            <div className="rounded-lg border aspect-square">by</div>
            <div className="rounded-lg border aspect-square">4</div>
            <div className="rounded-lg border aspect-square">5</div>
            <div className="rounded-lg border aspect-square">6</div>
            <div className="rounded-lg border aspect-square">date</div>
            <div className="rounded-lg border aspect-square">minus</div>
            <div className="rounded-lg border aspect-square">1</div>
            <div className="rounded-lg border aspect-square">2</div>
            <div className="rounded-lg border aspect-square">3</div>
            <div className="rounded-lg border row-span-2">done</div>
            <div className="rounded-lg border aspect-square">plus</div>
            <div className="rounded-lg border aspect-square">curr</div>
            <div className="rounded-lg border aspect-square">0</div>
            <div className="rounded-lg border aspect-square">info</div>
          </div>
        </section>
      </AccountsContextProvider>
    </CurrenciesContextProvider>
  )
}
