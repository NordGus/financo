import { zodResolver } from "@hookform/resolvers/zod"
import { Package, PackageOpen, Save, Trash, X } from "lucide-react"
import { ComponentProps, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useFetcher } from "react-router"
import { toast } from "sonner"
import { z } from "zod"
import { cn } from "~/lib/utils"
import { InfoDialog } from "~/modules/shared/components/dialogs/info"
import { ColorInput } from "~/modules/shared/components/inputs/color-input"
import { CurrencyAmountInput } from "~/modules/shared/components/inputs/currency-amount-input"
import { CurrencyInput } from "~/modules/shared/components/inputs/currency-input"
import { DateInput } from "~/modules/shared/components/inputs/date-input"
import { IconInput } from "~/modules/shared/components/inputs/icon-input"
import { Throbber } from "~/modules/shared/components/throbber"
import { Button } from "~/modules/shared/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/modules/shared/components/ui/dialog"
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
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "~/modules/shared/components/ui/tooltip"
import {
  isCapital,
  isCredit,
  isDebt,
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

type Kind = Kinds["capital"] | Kinds["savings"] | Kinds["debt"] | Kinds["credit"]

const NAME_MIN_LENGTH = 3
const NAME_MAX_LENGTH = 250
const DESCRIPTION_MAX_LENGTH = 1000

const DEFAULT_ICONS: Record<Kind, Icon> = {
  capital: "landmark",
  savings: "piggy-bank",
  debt: "hand-coins",
  credit: "credit-card"
}

const DEFAULT_COLORS: Record<Kind, string> = {
  capital: "#31e2c2",
  savings: "#0b8fe8",
  debt: "#fc004f",
  credit: "#8d3abd"
}

const DEFAULT_NAMES: Record<Kind, string> = {
  capital: "New Capital Account",
  savings: "New Savings Account",
  debt: "New Debt",
  credit: "New Credit Line"
}

const capitalAndSavingsSchema = z.object({
  kind: z.union([z.literal("capital"), z.literal("savings")]),
  currency: z.nativeEnum(CURRENCIES, { required_error: "required", message: "invalid option" }),
  color: z.string({ required_error: "required" })
    .max(10, { message: "invalid" }),
  icon: z.nativeEnum(ICONS, { required_error: "required", message: "invalid option" }),
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
  intent: z.enum(["create", "update"])
})

const debtSchema = z.object({
  kind: z.literal("debt"),
  currency: z.nativeEnum(CURRENCIES, { required_error: "required", message: "invalid option" }),
  color: z.string({ required_error: "required" })
    .max(10, { message: "invalid" }),
  icon: z.nativeEnum(ICONS, { required_error: "required", message: "invalid option" }),
  name: z.string({ required_error: "required" })
    .max(NAME_MAX_LENGTH, { message: "too long" })
    .min(NAME_MIN_LENGTH, { message: "too short" }),
  description: z.string()
    .max(DESCRIPTION_MAX_LENGTH, { message: "too long" })
    .nullish(),
  capital: z.number({ required_error: "required" })
    .refine((val) => val !== 0, { message: "required" }),
  main: z.boolean({ required_error: "required" }),
  hasHistory: z.boolean({ required_error: "required" }),
  historyAt: z.date().nullish(),
  historyBalance: z.number().nullish(),
  intent: z.enum(["create", "update"])
})

const creditSchema = z.object({
  kind: z.literal("credit"),
  currency: z.nativeEnum(CURRENCIES, { required_error: "required", message: "invalid option" }),
  color: z.string({ required_error: "required" })
    .max(10, { message: "invalid" }),
  icon: z.nativeEnum(ICONS, { required_error: "required", message: "invalid option" }),
  name: z.string({ required_error: "required" })
    .max(NAME_MAX_LENGTH, { message: "too long" })
    .min(NAME_MIN_LENGTH, { message: "too short" }),
  description: z.string()
    .max(DESCRIPTION_MAX_LENGTH, { message: "too long" })
    .nullish(),
  capital: z.number({ required_error: "required" }).positive({ message: "must be positive" }),
  main: z.boolean({ required_error: "required" }),
  hasHistory: z.boolean({ required_error: "required" }),
  historyAt: z.date().nullish(),
  historyBalance: z.number().nullish(),
  intent: z.enum(["create", "update"])
})

const schema = z.union([capitalAndSavingsSchema, debtSchema, creditSchema])

type Props = {
  kind: Kind
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
  archivedAt: Date | null | undefined
  transactions: number
  role: "create" | "update"
}

export function FormTemplate({
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
  archivedAt,
  transactions,
  role,
  ...props
}: ComponentProps<"form"> & Props) {
  const fetcher = useFetcher()

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      kind: kind,
      currency,
      color: color ?? DEFAULT_COLORS[kind],
      icon: icon ?? DEFAULT_ICONS[kind],
      name: name ?? DEFAULT_NAMES[kind],
      description,
      capital: capital ?? 0,
      main: main ?? false,
      hasHistory: hasHistory ?? false,
      historyAt,
      historyBalance,
      intent: role
    }
  })

  useEffect(() => {
    if (currency) form.setValue("currency", currency)
    form.setValue("color", color ?? DEFAULT_COLORS[kind])
    form.setValue("icon", icon ?? DEFAULT_ICONS[kind])
    form.setValue("name", name ?? DEFAULT_NAMES[kind])
    form.setValue("description", description)
    form.setValue("capital", capital ?? 0)
    form.setValue("main", main ?? false)
    form.setValue("hasHistory", !!hasHistory)
    form.setValue("historyAt", historyAt)
    form.setValue("historyBalance", historyBalance)
    form.setValue("intent", role)
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

  useEffect(() => {
    if (Object.keys(form.formState.errors).length === 0) return

    console.error(form.formState.errors)
  }, [form.formState.errors])

  const formName = form.watch("name")
  const formKind = form.watch("kind")
  const formCurrency = form.watch("currency")
  const formHasHistory = form.watch("hasHistory")
  const formColor = form.watch("color")

  const onSubmit = async (values: z.infer<typeof schema>) => {
    const promise = fetcher.submit({
      ...values,
      historyAt: values.historyAt ? values.historyAt.toDateString() : null,
    }, { method: "post" })

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

  const onDestroy = async () => {
    if (role !== "update") {
      toast.error("This account is not saved yet")
      return
    }

    const promise = fetcher.submit({ intent: "destroy" }, { method: "post" })

    toast.promise(
      promise,
      {
        loading: "Deleting...",
        success: () => `${formName} deleted!`,
        error: `Couldn't delete ${formName}, something went wrong"`
      }
    )
  }

  const onArchiveOrUnarchive = async () => {
    if (role !== "update") {
      toast.error("This account is not saved yet")
      return
    }

    const archive = archivedAt?.toDateString()
    const promise = fetcher.submit({ intent: !archive ? "archive" : "unarchive" }, { method: "post" })

    toast.promise(
      promise,
      {
        loading: !archive ? "Archiving..." : "Unarchiving...",
        success: () => !archive ? `${formName} archived!` : `${formName} unarchived!`,
        error: () => !archive
          ? `Couldn't archive ${formName}, something went wrong`
          : `Couldn't unarchive ${formName}, something went wrong`
      }
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
        className={cn("overflow-auto flex flex-col gap-2 px-1", props.className)}
        id="account-form"
      >
        <div
          className="grid grid-rows-2 h-42 gap-2 rounded-lg shadow-xs p-4"
          style={{ backgroundColor: formColor }}
        >
          <div className="flex gap-2 items-start">
            {
              role === "update" && (
                <>
                  <Dialog>
                    <Tooltip>
                      <DialogTrigger asChild>
                        <TooltipTrigger asChild>
                          <Button type="button" variant="destructive" size={"icon"} className="dark:bg-destructive">
                            <Trash />
                          </Button>
                        </TooltipTrigger>
                      </DialogTrigger>
                      <TooltipContent>
                        {"Delete Account"}
                      </TooltipContent>
                    </Tooltip>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {`Do you want to delete this Account?`}
                        </DialogTitle>
                        <DialogDescription>
                          {`This action is irreversible. It will also delete ${transactions} transaction(s) related to this Account.`}
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant={"outline"} type="button">
                            <X /> Cancel
                          </Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button onClick={onDestroy} variant={"destructive"} type="button">
                            <Trash /> Delete
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <Tooltip>
                      <DialogTrigger asChild>
                        <TooltipTrigger asChild>
                          <Button type="button" variant="secondary" size={"icon"}>
                            {!archivedAt ? <Package /> : <PackageOpen />}
                          </Button>
                        </TooltipTrigger>
                      </DialogTrigger>
                      <TooltipContent>
                        {!archivedAt ? "Archive Account" : "Unarchive Account"}
                      </TooltipContent>
                    </Tooltip>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {
                            !archivedAt
                              ? `Do you want to archive this Account?`
                              : `Do you want to unarchive this Account?`
                          }
                        </DialogTitle>
                        <DialogDescription>
                          {`This action can be reversed. It does not delete any of the ${transactions} transaction(s) related to this Account. `}
                          {
                            !archivedAt
                              ? `It only makes this Account stop appearing as an option anywhere else in financo.`
                              : `It only makes this Account appear as an option anywhere else in financo, again.`
                          }
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant={"outline"} type="button">
                            <X /> Cancel
                          </Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button onClick={onArchiveOrUnarchive} type="button">
                            {
                              !archivedAt
                                ? <><Package /> Archive</>
                                : <><PackageOpen /> Unarchive</>
                            }
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )
            }
            <span className="flex-1 contents-[' ']" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="submit" form="account-form" size={"icon"}>
                  {
                    fetcher.state !== "idle"
                      ? <Throbber />
                      : <Save />
                  }
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {
                  role === "update"
                    ? "Update Account"
                    : "Create Account"
                }
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex justify-between items-end gap-2">
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
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => {
            const charCount = field.value?.length ?? 0
            const isApproachingLimit = charCount >= NAME_MAX_LENGTH * 0.9
            const isAboveLimit = charCount > NAME_MAX_LENGTH

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
                <FormDescription>
                  {NAME_MAX_LENGTH - charCount} characters remaining
                </FormDescription>
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
                <FormDescription>
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
        { // NOTE: Only credit an
          (isDebt(formKind) || isCredit(formKind)) && (
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
          )
        }
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