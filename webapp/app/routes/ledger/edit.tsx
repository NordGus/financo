import { useMemo } from "react";
import {
  createSearchParams,
  redirect
} from "react-router";
import z from "zod";
import { destroy as destroyTransaction } from "~/modules/ledger/api/commands/destroy";
import { update as updateTransaction } from "~/modules/ledger/api/commands/update";
import { get as getTransactionQuery } from "~/modules/ledger/api/queries/transactions/get";
import { FormTemplate } from "~/modules/ledger/components/form-template";
import { schema as destroyActionSchema } from "~/modules/ledger/schemas/destroy";
import { schema as updateActionSchema } from "~/modules/ledger/schemas/update";
import { TransactionRecord } from "~/modules/ledger/types/transactions";
import { Route } from "./+types/edit";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const transaction = await getTransactionQuery(Number(params.id))

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

export default function Edit({ loaderData }: Route.ComponentProps) {
  const transaction = useMemo<TransactionRecord>(() => ({
    sourceId: loaderData.transaction.sourceId,
    targetId: loaderData.transaction.targetId,
    sourceAmount: loaderData.transaction.sourceAmount,
    targetAmount: loaderData.transaction.targetAmount,
    issuedAt: new Date(loaderData.transaction.issuedAt),
    executedAt: loaderData.transaction.executedAt ? new Date(loaderData.transaction.executedAt) : null,
    notes: loaderData.transaction.notes,
    currency: loaderData.transaction.currency,
    kind: loaderData.transaction.metadata.kind
  }), [
    loaderData.transaction.sourceId,
    loaderData.transaction.targetId,
    loaderData.transaction.sourceAmount,
    loaderData.transaction.targetAmount,
    loaderData.transaction.issuedAt,
    loaderData.transaction.executedAt,
    loaderData.transaction.notes,
    loaderData.transaction.currency,
    loaderData.transaction.metadata.kind,
    loaderData.transaction.updatedAt,
  ])

  return (
    <section className="flex flex-col py-2 overflow-hidden relative">
      <FormTemplate
        sourceId={transaction.sourceId}
        targetId={transaction.targetId}
        sourceAmount={transaction.sourceAmount}
        targetAmount={transaction.targetAmount}
        issuedAt={transaction.issuedAt}
        executedAt={transaction.executedAt}
        notes={transaction.notes}
        currency={transaction.currency}
        kind={transaction.kind}
        role="update"
      />
    </section>
  )
}
