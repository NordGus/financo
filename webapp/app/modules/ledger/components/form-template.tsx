import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ArrowLeftRight, Save, Trash } from "lucide-react";
import { ComponentProps, use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { cn } from "~/lib/utils";
import { CurrencyInput } from "~/modules/shared/components/inputs/currency-input";
import { FullScreenThrobber, Throbber } from "~/modules/shared/components/throbber";
import { Button } from "~/modules/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage
} from "~/modules/shared/components/ui/form";
import { Label } from "~/modules/shared/components/ui/label";
import { Switch } from "~/modules/shared/components/ui/switch";
import { Textarea } from "~/modules/shared/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/modules/shared/components/ui/tooltip";
import { CURRENCIES, Currency } from "~/modules/shared/types/currency";
import { AccountsContext } from "../contexts/accounts-context";
import { Account } from "../types/accounts";
import { DATE_FORMAT, Kind, KINDS } from "../types/transactions";
import { AmountInput } from "./form/amount-input";
import { ExecutedAt, IssuedAt } from "./form/transaction-date-selectors";
import { TransactionSource, TransactionTarget } from "./form/transaction-source-target";

const NOTES_MAX_LENGTH = 1000

const schema = z.object({
  sourceId: z.number({
    required_error: "Source account is required",
  }).positive(),
  targetId: z.number({
    required_error: "Target account is required",
  }).positive(),
  sourceAmount: z.number({
    required_error: "Amount is required",
  }).refine(val => val !== 0, {
    message: "Amount must be greater than 0",
  }),
  targetAmount: z.number({
    required_error: "Amount is required",
  }).refine(val => val !== 0, {
    message: "Amount must be greater than 0",
  }),
  issuedAt: z.date({
    required_error: "Issued date is required",
  }),
  executedAt: z.date().nullish(),
  notes: z.string().max(NOTES_MAX_LENGTH, {
    message: "Notes is too long"
  }).nullish(),
  currency: z.nativeEnum(CURRENCIES),
  kind: z.nativeEnum(KINDS)
})

type Transaction = {
  sourceId: number
  targetId: number
  sourceAmount: number
  targetAmount: number
  issuedAt: Date
  executedAt: Date | null | undefined
  notes: string | null | undefined,
  currency: Currency,
  kind: Kind
}

function capitalizeKind(kind: Kind): string {
  return `${kind.at(0)!.toLocaleUpperCase()}${kind.slice(1)}`
}

function isWithConversionRate(source: Account, target: Account, transactionCurrency: Currency): boolean {
  switch (true) {
    case source.currency !== "MULTI" && target.currency !== "MULTI":
      return source.currency !== target.currency
    default:
      return (source.currency === "MULTI" ? target.currency : source.currency) !== transactionCurrency
  }
}

type Props = {
  transaction: Transaction
  role: "create" | "update"
}

export function FormTemplate({ transaction, className, role, ...props }: ComponentProps<"form"> & Props) {
  const { accountsMap: accounts } = use(AccountsContext)

  const [isPendingTransaction, setIsPendingTransaction] = useState(!transaction.executedAt)
  const [isHistoryTransaction, setIsHistoryTransaction] = useState(
    accounts.get(transaction.sourceId)!.kind === "history" ||
    accounts.get(transaction.targetId)!.kind === "history"
  )
  const [withConversionRate, setWithConversionRate] = useState<boolean>(isWithConversionRate(
    accounts.get(transaction.sourceId)!,
    accounts.get(transaction.targetId)!,
    transaction.currency
  ))

  // NOTE: Fetchers allow action redirects to happen.
  const fetcher = useFetcher()

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      sourceId: transaction.sourceId,
      targetId: transaction.targetId,
      sourceAmount: transaction.sourceAmount,
      targetAmount: transaction.targetAmount,
      issuedAt: transaction.issuedAt,
      executedAt: transaction.executedAt,
      notes: transaction.notes,
      currency: transaction.currency,
      kind: transaction.kind,
    }
  })

  useEffect(() => {
    form.setValue("sourceId", transaction.sourceId)
    form.setValue("targetId", transaction.targetId)
    form.setValue("sourceAmount", transaction.sourceAmount)
    form.setValue("targetAmount", transaction.targetAmount)
    form.setValue("issuedAt", transaction.issuedAt)
    form.setValue("executedAt", transaction.executedAt)
    form.setValue("currency", transaction.currency)
    form.setValue("kind", transaction.kind)
    form.setValue("notes", transaction.notes)

    setIsPendingTransaction(!transaction.executedAt)
    setWithConversionRate(isWithConversionRate(
      accounts.get(transaction.sourceId)!,
      accounts.get(transaction.targetId)!,
      transaction.currency
    ))
    setIsHistoryTransaction(
      accounts.get(transaction.sourceId)!.kind === "history" ||
      accounts.get(transaction.targetId)!.kind === "history"
    )
  }, [transaction])

  useEffect(() => {
    setWithConversionRate(isWithConversionRate(
      accounts.get(form.getValues("sourceId"))!,
      accounts.get(form.getValues("targetId"))!,
      form.getValues("currency")
    ))

    setIsHistoryTransaction(
      accounts.get(form.getValues("sourceId"))!.kind === "history" ||
      accounts.get(form.getValues("targetId"))!.kind === "history"
    )
  }, [
    form.getValues("sourceId"),
    form.getValues("targetId"),
    form.getValues("currency"),
    accounts
  ])

  const onSubmit = async (values: z.infer<typeof schema>) => {
    if (
      accounts.get(values.sourceId)!.kind === "history" ||
      accounts.get(values.targetId)!.kind === "history"
    ) {
      toast.error("You cannot register nor modify history transactions")
      return
    }

    const promise = fetcher.submit({
      ...values,
      issuedAt: format(values.issuedAt, DATE_FORMAT),
      executedAt: values.executedAt ? format(values.executedAt, DATE_FORMAT) : null,
      notes: values.notes ?? null,
      intent: role
    }, { method: "post", encType: "application/json" })

    toast.promise(
      promise,
      {
        loading: role === "create" ? "Creating..." : "Updating...",
        success: () => {
          if (values.executedAt) {
            return `${capitalizeKind(values.kind)} registered at ${format(values.executedAt, "PPP")}`
          }

          return `Pending ${values.kind} registered at ${format(values.issuedAt, "PPP")}`
        },
        error: "Oops!. Something went wrong"
      }
    )
  }

  const onDestroy = async () => {
    if (isHistoryTransaction) {
      toast.error("You delete history transactions")
      return
    }

    const promise = fetcher.submit({
      ...transaction,
      issuedAt: format(transaction.issuedAt, DATE_FORMAT),
      executedAt: transaction.executedAt ? format(transaction.executedAt, DATE_FORMAT) : null,
      notes: transaction.notes ?? null,
      intent: "destroy"
    }, { method: "post", encType: "application/json" })

    toast.promise(
      promise,
      {
        loading: "Deleting...",
        success: () => "Transaction deleted",
        error: "Oops!. Something went wrong"
      }
    )
  }

  return (
    <>
      <FullScreenThrobber
        className={cn(
          "absolute inset-0 z-50",
          (fetcher.state === "idle") && "hidden"
        )}
      />
      <Form {...form}>
        <form
          className={cn("grid grid-cols-2 px-1 grid-rows-[min-content_0.5fr_min-content_min-content_0.25fr_1fr] h-full max-h-full gap-2 overflow-y-auto no-scrollbar", className)}
          {...props}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="col-span-2 flex gap-2 items-center">
            {
              role === "update" && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      size={"icon"}
                      onClick={onDestroy}
                      disabled={isHistoryTransaction}
                    >
                      <Trash />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {"Delete Transaction"}
                  </TooltipContent>
                </Tooltip>
              )
            }
            <span className="flex-grow contents-[' ']" />
            <div className="col-span-2 flex gap-2 items-center *:cursor-pointer">
              <Switch
                id="is-pending-transaction"
                checked={isPendingTransaction}
                onCheckedChange={checked => {
                  if (checked) form.setValue("executedAt", null)
                  else form.setValue("executedAt", form.getValues("issuedAt"))

                  setIsPendingTransaction(checked)
                }}
                disabled={isHistoryTransaction}
              />
              <Label htmlFor="is-pending-transaction">This transaction has no effective date, yet</Label>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant={"secondary"}
                  onClick={() => {
                    const kind = form.getValues("kind")
                    const source = accounts.get(form.getValues("sourceId"))!
                    const sourceAmount = form.getValues("sourceAmount")
                    const target = accounts.get(form.getValues("targetId"))!
                    const targetAmount = form.getValues("targetAmount")

                    // An expense transaction becomes an income transaction when switching direction.
                    if (kind === "expense") form.setValue("kind", "income")
                    // An income transaction becomes an expense transaction when switching direction.
                    if (kind === "income") form.setValue("kind", "expense")
                    // A transfer transaction does not change its kind because it maintains its behavior

                    // When the transaction does not contain a MULTI currency account aka. category, the transaction
                    // stores the target's currency, so it needs to the change the currency to that one of the
                    // future target aka the current source.
                    //
                    // This change is ignored for transactions which contain a MULTI currency account aka. category,
                    // because the currency is user defined or is simply inherited from the non-MULTI currency account
                    // aka. account in the transaction.
                    if (source.currency !== "MULTI" && target.currency !== "MULTI") {
                      form.setValue("currency", source.currency)
                    }

                    form.setValue("sourceId", target.id)
                    form.setValue("sourceAmount", targetAmount)
                    form.setValue("targetId", source.id)
                    form.setValue("targetAmount", sourceAmount)
                  }}
                  disabled={isHistoryTransaction}
                >
                  <ArrowLeftRight />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {"Switch Transaction Direction"}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  size={"icon"}
                  disabled={isHistoryTransaction}
                >
                  {
                    fetcher.state === "submitting"
                      ? <Throbber />
                      : <Save />
                  }
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {
                  role === "update"
                    ? "Update Transaction"
                    : "Create Transaction"
                }
              </TooltipContent>
            </Tooltip>
          </div>

          <FormField
            control={form.control}
            name="sourceId"
            render={({ field }) => (
              <FormItem>
                <TransactionSource
                  id={field.value}
                  onChange={(newKind, id) => {
                    const currentKind = form.getValues("kind")
                    const source = accounts.get(id)!
                    const target = accounts.get(form.getValues("targetId"))!
                    const sourceAmount = form.getValues("sourceAmount")
                    const targetAmount = form.getValues("targetAmount")

                    // When new kind is the same as the current one, we simply need to update the source id and do
                    // nothing more.
                    if (newKind === currentKind) {
                      field.onChange(id)
                      return
                    }


                    // When the new kind is expense, we flip the direction of the transaction because expenses
                    // accounts are always target.
                    //
                    // It also means that the target is a non-MULTI currency account aka. account, so we need to worry
                    // about more details.
                    if (newKind === "expense") {
                      // If the new source is a non-MULTI currency account aka. account, we need to set the currency to
                      // its currency. If it is a MULTI currency account aka. category, the user should use the currency
                      // input to set the currency.
                      if (source.currency !== "MULTI") form.setValue("currency", source.currency)

                      form.setValue("kind", newKind)
                      form.setValue("sourceAmount", targetAmount)
                      form.setValue("targetAmount", sourceAmount)
                      form.setValue("targetId", id)
                      field.onChange(target.id)
                      return
                    }

                    // When new kind is transfer, we don't need change direction because the transaction is already
                    // at the right direction.
                    //
                    // It also means that the target is a non-MULTI currency account aka. account, and the source is
                    // also a non-MULTI currency account aka. account.
                    if (newKind === "transfer") {
                      // We need to set the currency to the target's because it is the currency of the transaction.
                      form.setValue("currency", target.currency as Currency)

                      form.setValue("kind", newKind)
                      field.onChange(id)
                    }

                    // When the new kind is income, we don't need change direction because the transaction is already
                    // at the right direction.
                    //
                    // It also means that the target is a non-MULTI currency account aka. account, so we need to worry
                    // about more details.

                    // If the new source is a non-MULTI currency account aka. account, we need to set the currency to
                    // target's currency. If it is a MULTI currency account aka. category, the user should use the
                    // currency input to set the currency.
                    if (source.currency !== "MULTI") form.setValue("currency", target.currency as Currency)

                    form.setValue("kind", newKind)
                    field.onChange(id)
                  }}
                  disabled={isHistoryTransaction}
                  kind={form.getValues("kind")}
                  targetId={form.getValues("targetId")}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="targetId"
            render={({ field }) => (
              <FormItem>
                <TransactionTarget
                  id={field.value}
                  onChange={(newKind, id) => {
                    const currentKind = form.getValues("kind")
                    const source = accounts.get(form.getValues("sourceId"))!
                    const target = accounts.get(id)!
                    const sourceAmount = form.getValues("sourceAmount")
                    const targetAmount = form.getValues("targetAmount")

                    // when new kind is the same as the current one, we simply need to update the source id and do
                    // nothing more.
                    if (newKind === currentKind) {
                      field.onChange(id)
                      return
                    }

                    // when the new kind is expense, we don't need change direction because the transaction is already
                    // at the right direction.
                    //
                    // It also means that the source is a non-MULTI currency account aka. account, so we need to worry
                    // about more details.
                    if (newKind === "expense") {
                      // if the new target is a non-MULTI currency account aka. account, we need to set the currency to
                      // its currency. If it is a MULTI currency account aka. category, the user should use the currency
                      // input to set the currency.
                      if (target.currency !== "MULTI") form.setValue("currency", target.currency)

                      form.setValue("kind", newKind)
                      field.onChange(target.id)
                      return
                    }

                    // When new kind is transfer, we don't need change direction because the transaction is already
                    // at the right direction.
                    //
                    // It also means that the source is a non-MULTI currency account aka. account, and the target is
                    // also a non-MULTI currency account aka. account.
                    if (newKind === "transfer") {
                      // We need to set the currency to the target's because it is the currency of the transaction.
                      form.setValue("currency", target.currency as Currency)

                      form.setValue("kind", newKind)
                      field.onChange(id)
                    }

                    // When the new kind is expense, we flip the direction of the transaction because income
                    // accounts are always source.
                    //
                    // It also means that the source is a non-MULTI currency account aka. account, so we need to worry
                    // about more details.

                    // if the new target is a non-MULTI currency account aka. account, we need to set the currency to
                    // its currency. If it is a MULTI currency account aka. category, the user should use the currency
                    // input to set the currency.
                    if (target.currency !== "MULTI") form.setValue("currency", source.currency as Currency)

                    form.setValue("kind", newKind)
                    form.setValue("sourceAmount", targetAmount)
                    form.setValue("targetAmount", sourceAmount)
                    form.setValue("targetId", id)
                    field.onChange(source.id)
                  }}
                  disabled={isHistoryTransaction}
                  kind={form.getValues("kind")}
                  targetId={form.getValues("sourceId")}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="issuedAt"
            render={({ field }) => (
              <FormItem>
                <IssuedAt
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isHistoryTransaction}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="executedAt"
            render={({ field }) => (
              <FormItem>
                <ExecutedAt
                  value={field.value}
                  issuedAt={form.getValues("issuedAt")}
                  onChange={(date) => {
                    setIsPendingTransaction(!date)
                    field.onChange(date)
                  }}
                  disabled={isHistoryTransaction}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <CurrencyInput
                  onValueChange={(currency) => {
                    setWithConversionRate(isWithConversionRate(
                      accounts.get(form.getValues("sourceId"))!,
                      accounts.get(form.getValues("targetId"))!,
                      currency
                    ))

                    field.onChange(currency)
                  }}
                  defaultValue={field.value}
                  value={field.value}
                  disabled={
                    isHistoryTransaction || (
                      accounts.get(form.getValues("sourceId"))!.currency !== "MULTI" &&
                      accounts.get(form.getValues("targetId"))!.currency !== "MULTI"
                    )
                  }
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sourceAmount"
            render={({ field }) => (
              <FormItem className={cn("relative", !withConversionRate && "col-span-2")}>
                <AmountInput
                  value={field.value}
                  kind={form.getValues("kind")}
                  currency={
                    accounts.get(form.getValues("sourceId"))!.currency === "MULTI"
                      ? form.getValues("currency")
                      : accounts.get(form.getValues("sourceId"))!.currency as Currency
                  }
                  onValueChange={(value) => {
                    const newValue = Math.abs(value)
                    const targetAmount = form.getValues("targetAmount")
                    const sourceId = form.getValues("sourceId")
                    const targetId = form.getValues("targetId")
                    const kind = form.getValues("kind")

                    if (value < 0) {
                      form.setValue("targetAmount", newValue)

                      form.setValue("sourceId", targetId)
                      form.setValue("targetId", sourceId)

                      if (kind === "income") form.setValue("kind", "expense")
                      else if (kind === "expense") form.setValue("kind", "income")

                      field.onChange(targetAmount)

                      return
                    }

                    if (!withConversionRate) form.setValue("targetAmount", newValue)

                    field.onChange(newValue)
                  }}
                  dialogTitle="Source amount"
                  dialogDescription="Enter the amount removed form the source account"
                  style={{ borderColor: accounts.get(form.getValues("sourceId"))!.color }}
                  disabled={isHistoryTransaction}
                />
                <FormMessage className="absolute right-0 bottom-0 py-1 px-2" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="targetAmount"
            render={({ field }) => (
              <FormItem className={cn("relative", !withConversionRate && "hidden")}>
                <AmountInput
                  value={field.value}
                  kind={form.getValues("kind")}
                  currency={
                    accounts.get(form.getValues("targetId"))!.currency === "MULTI"
                      ? form.getValues("currency")
                      : accounts.get(form.getValues("targetId"))!.currency as Currency
                  }
                  onValueChange={(value) => {
                    const newValue = Math.abs(value)
                    const targetAmount = form.getValues("targetAmount")
                    const sourceId = form.getValues("sourceId")
                    const targetId = form.getValues("targetId")
                    const kind = form.getValues("kind")

                    if (value < 0) {
                      form.setValue("targetAmount", newValue)

                      form.setValue("sourceId", targetId)
                      form.setValue("targetId", sourceId)

                      if (kind === "income") form.setValue("kind", "expense")
                      else if (kind === "expense") form.setValue("kind", "income")

                      field.onChange(targetAmount)

                      return
                    }

                    field.onChange(newValue)
                  }}
                  dialogTitle="Target amount"
                  dialogDescription="Enter the amount added to the target account"
                  style={{ borderColor: accounts.get(form.getValues("targetId"))!.color }}
                  disabled={isHistoryTransaction}
                />
                <FormMessage className="absolute right-0 bottom-0 py-1 px-2" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => {
              const charCount = field.value?.length ?? 0
              const isApproachingLimit = charCount >= NOTES_MAX_LENGTH * 0.9

              return (
                <FormItem className="col-span-2 flex flex-col">
                  <FormControl className="flex-grow">
                    <Textarea
                      {...field}
                      value={field.value ?? undefined}
                      className={cn(
                        "resize-none",
                        isApproachingLimit && "border-yellow-500 focus-visible:ring-yellow-500"
                      )}
                      placeholder="Notes about the transaction..."
                      disabled={isHistoryTransaction}
                      maxLength={NOTES_MAX_LENGTH}
                    />
                  </FormControl>
                  <FormDescription className="text-right">
                    {NOTES_MAX_LENGTH - charCount} characters remaining
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        </form>
      </Form>
    </>
  )
}