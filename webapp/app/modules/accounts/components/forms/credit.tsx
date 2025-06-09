import { zodResolver } from "@hookform/resolvers/zod"
import { ComponentProps, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useFetcher } from "react-router"
import { toast } from "sonner"
import { z } from "zod/v4"
import { cn } from "~/lib/utils"
import { InfoDialog } from "~/modules/shared/components/dialogs/info"
import { ColorInput } from "~/modules/shared/components/inputs/color-input"
import { CurrencyAmountInput } from "~/modules/shared/components/inputs/currency-amount-input"
import { CurrencyInput } from "~/modules/shared/components/inputs/currency-input"
import { DateInput } from "~/modules/shared/components/inputs/date-input"
import { IconInput } from "~/modules/shared/components/inputs/icon-input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage
} from "~/modules/shared/components/ui/form"
import { Input } from "~/modules/shared/components/ui/input"
import { Label } from "~/modules/shared/components/ui/label"
import { Switch } from "~/modules/shared/components/ui/switch"
import { Textarea } from "~/modules/shared/components/ui/textarea"
import {
  Kinds
} from "~/modules/shared/types/account"
import {
  CURRENCIES,
  Currency
} from "~/modules/shared/types/currency"
import {
  Icon,
  ICONS
} from "~/modules/shared/types/icon"
import { hasIncompleteLedgerManual } from "../../manual/has-incomplete-ledger-manual"

const NAME_MIN_LENGTH = 3
const NAME_MAX_LENGTH = 250
const DESCRIPTION_MAX_LENGTH = 1000

const DEFAULT_ICON: Icon = "credit-card"
const DEFAULT_COLOR = "#8d3abd"
const DEFAULT_NAME = "New Credit Line"

const schema = z.object({
  kind: z.enum(["credit"]),
  currency: z.enum(CURRENCIES, { error: "required" }),
  color: z.string({ error: "required" })
    .max(10, { message: "invalid" }),
  icon: z.enum(ICONS, { error: "required" }),
  name: z.string({ error: "required" })
    .max(NAME_MAX_LENGTH, { message: "too long" })
    .min(NAME_MIN_LENGTH, { message: "too short" }),
  description: z.string()
    .max(DESCRIPTION_MAX_LENGTH, { message: "too long" })
    .nullish(),
  capital: z.number({ error: "required" }).positive({ error: "must be positive" }),
  main: z.boolean({ error: "required" }),
  hasHistory: z.boolean({ error: "required" }),
  historyAt: z.date().nullish(),
  historyBalance: z.number().nullish(),
  role: z.enum(["create", "update"])
})

type Props = {
  kind: Kinds["credit"]
  currency: Currency | undefined
  color: string | undefined
  icon: Icon | undefined
  name: string | undefined
  description: string | null | undefined
  capital: number | undefined
  main: boolean | undefined
  hasHistory: boolean | undefined
  historyAt: Date | null | undefined
  historyBalance: number | null | undefined
  role: "create" | "update"
}

export function CreditForm({
  kind,
  currency,
  color,
  icon,
  name,
  description,
  capital,
  main,
  hasHistory,
  historyAt,
  historyBalance,
  role,
  ...props
}: ComponentProps<"form"> & Props) {
  const fetcher = useFetcher()

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      kind: kind,
      currency,
      color: color ?? DEFAULT_COLOR,
      icon: icon ?? DEFAULT_ICON,
      name: name ?? DEFAULT_NAME,
      description,
      capital: capital ?? 0,
      main: main ?? false,
      hasHistory: hasHistory ?? false,
      historyAt,
      historyBalance,
      role
    }
  })

  useEffect(() => {
    if (currency) form.setValue("currency", currency)
    if (color) form.setValue("color", color)
    if (icon) form.setValue("icon", icon)
    if (name) form.setValue("name", name)
    form.setValue("description", description)
    if (capital) form.setValue("capital", capital)
    if (main) form.setValue("main", main)
    form.setValue("hasHistory", !!hasHistory)
    form.setValue("historyAt", historyAt)
    form.setValue("historyAt", historyAt)
    form.setValue("role", role)
  }, [
    currency,
    color,
    icon,
    name,
    description,
    capital,
    main,
    hasHistory,
    historyAt?.toDateString(),
    historyBalance,
    role,
  ])

  const formCurrency = form.watch("currency")
  const formHasHistory = form.watch("hasHistory")
  const formColor = form.watch("color")

  const onSubmit = async (values: z.infer<typeof schema>) => {
    const promise = fetcher.submit({
      ...values,
      historyAt: values.historyAt ? values.historyAt.toDateString() : null,
    }, { method: "post", encType: "application/json" })

    toast.promise(
      promise,
      {
        loading: role === "create" ? "Creating..." : "Updating...",
        success: () => {
          return `${values.name} account created!`
        },
        error: `Couldn't save ${values.name}, something went wrong`
      }
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
        className={cn("overflow-auto flex flex-col gap-2 px-1", props.className)}
      >
        <div
          className="flex justify-between items-end h-42 gap-2 rounded-lg shadow-xs p-4"
          style={{ backgroundColor: formColor }}
        >
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <IconInput
                  value={field.value}
                  onChange={field.onChange}
                  color={formColor}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <ColorInput value={field.value} onChange={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => {
            const charCount = field.value?.length ?? 0
            const isApproachingLimit = charCount >= NAME_MAX_LENGTH * 0.9
            const isAboveLimit = charCount > NAME_MAX_LENGTH
            const isTooShort = charCount < NAME_MIN_LENGTH

            return (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    className={cn(
                      isApproachingLimit && "border-yellow-500 focus-visible:ring-yellow-500",
                      isAboveLimit && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                </FormControl>
                <FormDescription className="text-right">
                  {NAME_MAX_LENGTH - charCount} characters remaining
                </FormDescription>
                {isTooShort && (
                  <FormDescription className="text-right text-destructive">
                    too short
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => {
            const charCount = field.value?.length ?? 0
            const isApproachingLimit = charCount >= DESCRIPTION_MAX_LENGTH * 0.9
            const isAboveLimit = charCount > DESCRIPTION_MAX_LENGTH

            return (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? undefined}
                    placeholder="You can add a little extra information about this Account..."
                    maxLength={DESCRIPTION_MAX_LENGTH}
                    className={cn(
                      "h-32",
                      isApproachingLimit && "border-yellow-500 focus-visible:ring-yellow-500",
                      isAboveLimit && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                </FormControl>
                <FormDescription className="text-right">
                  {DESCRIPTION_MAX_LENGTH - charCount} characters remaining
                </FormDescription>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <CurrencyInput onValueChange={field.onChange} defaultValue={field.value} value={field.value} />
              <FormDescription>
                The currency of your debt
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="capital"
          render={({ field }) => (
            <FormItem>
              <CurrencyAmountInput
                currency={formCurrency}
                value={field.value}
                onChange={field.onChange}
                name="Capital"
                placeholder="Capital"
                forDebts={true}
                fixedSign={true}
              />
              <FormDescription>
                {"The amount you allowed to get in debt with your creditor."}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hasHistory"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <Switch
                checked={field.value}
                onCheckedChange={checked => {
                  form.setValue("historyAt", checked ? new Date() : undefined)
                  form.setValue("historyBalance", checked ? 0 : undefined)
                  field.onChange(checked)
                }}
              />
              <Label htmlFor="has-form">Has incomplete an incomplete ledger</Label>
              <InfoDialog copy={hasIncompleteLedgerManual} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="historyAt"
          render={({ field }) => (
            <FormItem>
              <DateInput
                value={field.value ?? undefined}
                onSelect={field.onChange}
                disabled={!formHasHistory}
                placeholder="Starts at"
              />
              <FormDescription>
                The date from where your ledger starts
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="historyBalance"
          render={({ field }) => (
            <FormItem>
              <CurrencyAmountInput
                currency={formCurrency}
                value={field.value ?? undefined}
                onChange={field.onChange}
                name="Starting Balance"
                disabled={!formHasHistory}
                placeholder="Starting Balance"
              />
              <FormDescription>
                The balance of the credit line at the starting date
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}