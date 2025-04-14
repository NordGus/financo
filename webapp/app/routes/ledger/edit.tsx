import { useLocation, useNavigation } from "react-router";
import { cn } from "~/lib/utils";
import { get as getTransactionQuery } from "~/modules/ledger/api/queries/transactions/get";
import { FormTemplate } from "~/modules/ledger/components/form-template";
import { AccountsContextProvider } from "~/modules/ledger/contexts/accounts-context";
import { FullScreenThrobber } from "~/modules/shared/components/throbber";
import { CurrenciesContextProvider } from "~/modules/shared/contexts/currencies-context";
import { Route } from "./+types/edit";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const transaction = await getTransactionQuery(Number(params.id))

  return { breadcrumb: "Edit Transaction", transaction }
}

export default function Edit({ loaderData: { transaction }, matches }: Route.ComponentProps) {
  // extracting data from webapp/app/modules/shared/layout.tsx's loader.
  const { data: { currencies } } = matches[1]
  // extracting data from webapp/app/routes/ledger/_layout.tsx's loader.
  const { data: { accounts, accountsMap } } = matches[2]

  const { pathname } = useLocation() // current location
  const { state: navigationState, location } = useNavigation() // navigation location

  return (
    <CurrenciesContextProvider currencies={currencies}>
      <AccountsContextProvider accounts={accounts} accountsMap={accountsMap}>
        <section className="flex flex-col h-full max-h-full py-4 overflow-hidden relative">
          <FullScreenThrobber
            className={cn(
              "absolute inset-0 z-50",
              (navigationState === "idle" || location.pathname === pathname) && "hidden"
            )}
          />
          <FormTemplate
            transaction={{
              sourceId: transaction.sourceId,
              targetId: transaction.targetId,
              sourceAmount: transaction.sourceAmount,
              targetAmount: transaction.targetAmount,
              issuedAt: new Date(transaction.issuedAt),
              executedAt: transaction.executedAt ? new Date(transaction.executedAt) : null,
              currency: transaction.currency,
              kind: transaction.metadata.kind
            }}
            role="update"
          />
        </section>
      </AccountsContextProvider>
    </CurrenciesContextProvider>
  )
}
