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
import { Kind, TransactionRecord } from "~/modules/ledger/types/transactions";
import { FullScreenThrobber } from "~/modules/shared/components/throbber";
import { Currency } from "~/modules/shared/types/currency";
import { Route } from "./+types/edit";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const transactionData = await getTransactionQuery(Number(params.id))

  const transaction: TransactionRecord = {
    sourceId: transactionData.sourceId,
    targetId: transactionData.targetId,
    sourceAmount: transactionData.sourceAmount,
    targetAmount: transactionData.targetAmount,
    issuedAt: new Date(transactionData.issuedAt),
    executedAt: transactionData.executedAt ? new Date(transactionData.executedAt) : null,
    notes: transactionData.notes,
    currency: transactionData.currency,
    kind: transactionData.metadata.kind
  }

  return {
    transaction
  }
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

export default function Edit({ loaderData: { transaction } }: Route.ComponentProps) {
  const { pathname } = useLocation() // current location
  const { state: navigationState, location } = useNavigation() // navigation location

  return (
    <section className="flex flex-col py-2 overflow-hidden relative">
      <FullScreenThrobber
        className={cn(
          "absolute inset-0 z-50",
          (navigationState === "idle" || location.pathname === pathname) && "hidden"
        )}
      />
      <FormTemplate transaction={transaction} role="update" />
    </section>
  )
}
