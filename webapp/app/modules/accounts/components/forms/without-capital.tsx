import { zodResolver } from "@hookform/resolvers/zod"
import { ComponentProps, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useFetcher } from "react-router"
import { toast } from "sonner"
import { z } from "zod"
import { cn } from "~/lib/utils"
import { InfoDialog } from "~/modules/shared/components/dialogs/info"
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
  FormLabel,
  FormMessage
} from "~/modules/shared/components/ui/form"
import { Input } from "~/modules/shared/components/ui/input"
import { Label } from "~/modules/shared/components/ui/label"
import { Switch } from "~/modules/shared/components/ui/switch"
import { Textarea } from "~/modules/shared/components/ui/textarea"
import {
  isCapital,
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
import { mainAccountManual } from "../../manual/main-account-manual"

const NAME_MIN_LENGTH = 3
const NAME_MAX_LENGTH = 250
const DESCRIPTION_MAX_LENGTH = 1000

const schema = z.object({
  kind: z.enum(["capital", "savings"]),
  currency: z.nativeEnum(CURRENCIES, { required_error: "required" }),
  color: z.string({ required_error: "required" })
    .max(10, { message: "invalid" }),
  icon: z.nativeEnum(ICONS, { required_error: "required" }),
  name: z.string({ required_error: "required" })
    .max(NAME_MAX_LENGTH, { message: "too long" })
    .min(NAME_MIN_LENGTH, { message: "too short" }),
  description: z.string()
    .max(DESCRIPTION_MAX_LENGTH, { message: "too long" })
    .nullish(),
  capital: z.number({ required_error: "required" })
    .min(0, { message: "must be zero" })
    .max(0, { message: "must be zero" }),
  main: z.boolean({ required_error: "required" }),
  hasHistory: z.boolean({ required_error: "required" }),
  historyAt: z.date().nullish(),
  historyBalance: z.number().nullish(),
  role: z.enum(["create", "update"])
})

type Props = {
  kind: Kinds["capital"] | Kinds["savings"]
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

export function WithoutCapitalForm({
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
      color: color ?? { capital: "#31e2c2", savings: "#0b8fe8" }[kind],
      icon: icon ?? "landmark",
      name: name ?? "New Capital Account",
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

  const formKind = form.watch("kind")
  const formCurrency = form.watch("currency")
  const formHasHistory = form.watch("hasHistory")

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
        <div className="grid grid-cols-[min-content_1fr] gap-2">
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <IconInput
                    value={field.value}
                    onChange={field.onChange}
                    entity="account"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} type={"color"} className="cursor-pointer" />
                </FormControl>
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
                The currency this account will operate in with
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {
          isCapital(formKind) && (
            <FormField
              control={form.control}
              name="main"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="cursor-pointer">This is my main Account</FormLabel>
                  <InfoDialog copy={mainAccountManual} />
                </FormItem>
              )}
            />
          )
        }
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
                The balance of the account at the starting date
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}