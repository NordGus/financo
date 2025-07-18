import {
  createSearchParams,
  redirect,
  useLocation,
  useNavigation
} from "react-router";
import z from "zod";
import { cn } from "~/lib/utils";
import { destroy as destroyTransaction } from "~/modules/ledger/api/commands/destroy";
import { update as updateTransaction } from "~/modules/ledger/api/commands/update";
import { get as getTransactionQuery } from "~/modules/ledger/api/queries/transactions/get";
import { FormTemplate } from "~/modules/ledger/components/form-template";
import { schema as destroyActionSchema } from "~/modules/ledger/schemas/destroy";
import { schema as updateActionSchema } from "~/modules/ledger/schemas/update";
import { TransactionRecord } from "~/modules/ledger/types/transactions";
import { FullScreenThrobber } from "~/modules/shared/components/throbber";
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

const operateOnTransactionSchema = z.discriminatedUnion(
  "intent",
  [updateActionSchema, destroyActionSchema]
)

export async function clientAction({ request, params }: Route.ClientActionArgs) {
  const id = Number(params.id)
  const action = operateOnTransactionSchema.safeParse(await request.json())
  const searchParams = new URL(request.url).searchParams

  if (!action.success) throw action.error

  switch (action.data.intent) {
    case "destroy":
      await destroyTransaction(id)

      return redirect(`/ledger?${createSearchParams(searchParams)}`)
    case "update":
      await updateTransaction(id, {
        sourceId: action.data.sourceId,
        targetId: action.data.targetId,
        sourceAmount: action.data.sourceAmount,
        targetAmount: action.data.targetAmount,
        issuedAt: action.data.issuedAt,
        executedAt: action.data.executedAt,
        notes: action.data.notes,
        currency: action.data.currency,
        kind: action.data.kind
      })

      return redirect(`/ledger/${id}?${createSearchParams(searchParams)}`)
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
