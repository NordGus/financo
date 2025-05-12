import {
  createSearchParams,
  redirect,
  useLocation,
  useNavigation
} from "react-router";
import { cn } from "~/lib/utils";
import { destroy as destroyTransaction } from "~/modules/ledger/api/commands/destroy";
import { update as updateTransaction } from "~/modules/ledger/api/commands/update";
import { get as getTransactionQuery } from "~/modules/ledger/api/queries/transactions/get";
import { FormTemplate } from "~/modules/ledger/components/form-template";
import { AccountsContextProvider } from "~/modules/ledger/contexts/accounts-context";
import { Kind } from "~/modules/ledger/types/transactions";
import { FullScreenThrobber } from "~/modules/shared/components/throbber";
import { CurrenciesContextProvider } from "~/modules/shared/contexts/currencies-context";
import { Currency } from "~/modules/shared/types/currency";
import { Route } from "./+types/edit";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const transaction = await getTransactionQuery(Number(params.id))

  return { breadcrumb: "Edit Transaction", transaction }
}

type OperateOnTransaction = {
  sourceId: number
  targetId: number
  sourceAmount: number
  targetAmount: number
  issuedAt: string
  executedAt: string | null
  notes: string | null
  currency: Currency
  kind: Kind
  intent: "create" | "update" | "destroy"
}

export async function clientAction({ request, params }: Route.ClientActionArgs) {
  const id = Number(params.id)
  const data = await request.json() as OperateOnTransaction
  const searchParams = new URL(request.url).searchParams

  const { sourceId, targetId, sourceAmount, targetAmount, issuedAt, executedAt, notes, currency, kind } = data

  switch (data.intent) {
    case "destroy":
      await destroyTransaction(id)

      return redirect(`/ledger?${createSearchParams(searchParams)}`)
    case "update":
      await updateTransaction(id, {
        sourceId,
        targetId,
        sourceAmount,
        targetAmount,
        issuedAt,
        executedAt,
        notes,
        currency,
        kind
      })

      return redirect(`/ledger/${id}?${createSearchParams(searchParams)}`)
    default:
      throw new Error("Invalid intent", { cause: `invalid intent '${data.intent}' expected: update or destroy` })
  }
}

export default function Edit({ loaderData: { transaction }, matches }: Route.ComponentProps) {
  // extracting data from webapp/app/modules/shared/layout.tsx's loader.
  const { data: { currencies } } = matches[1]
  // extracting data from webapp/app/routes/ledger/_layout.tsx's loader.
  const { data: { accounts, accountsMap, accountsChildren } } = matches[2]

  const { pathname } = useLocation() // current location
  const { state: navigationState, location } = useNavigation() // navigation location

  return (
    <CurrenciesContextProvider currencies={currencies}>
      <AccountsContextProvider accounts={accounts} accountsMap={accountsMap} accountsChildren={accountsChildren}>
        <section className="flex flex-col py-2 overflow-hidden relative">
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
              notes: transaction.notes,
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
