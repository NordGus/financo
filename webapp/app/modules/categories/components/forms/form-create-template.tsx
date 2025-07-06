import { zodResolver } from "@hookform/resolvers/zod"
import { Save } from "lucide-react"
import { ComponentProps, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useFetcher } from "react-router"
import { toast } from "sonner"
import { z } from "zod"
import { cn } from "~/lib/utils"
import { ColorInput } from "~/modules/shared/components/inputs/color-input"
import { IconInput } from "~/modules/shared/components/inputs/icon-input"
import { Throbber } from "~/modules/shared/components/throbber"
import { Button } from "~/modules/shared/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage
} from "~/modules/shared/components/ui/form"
import { Input } from "~/modules/shared/components/ui/input"
import { Textarea } from "~/modules/shared/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "~/modules/shared/components/ui/tooltip"
import {
  Kinds
} from "~/modules/shared/types/account"
import {
  Icon,
  ICONS
} from "~/modules/shared/types/icon"

type Kind = Kinds["expense"] | Kinds["income"]

const NAME_MIN_LENGTH = 3
const NAME_MAX_LENGTH = 250
const DESCRIPTION_MAX_LENGTH = 1000

const DEFAULT_ICONS: Record<Kind, Icon> = {
  expense: "bookmark",
  income: "banknote"
}

const DEFAULT_COLORS: Record<Kind, string> = {
  expense: "#fa4141",
  income: "#04d344"
}

const DEFAULT_NAMES: Record<Kind, string> = {
  expense: "New Expense Category",
  income: "New Income Category"
}

const DEFAULT_SUBCATEGORY_NAMES: Record<Kind, string> = {
  expense: "New Expense Subcategory",
  income: "New Income Subcategory"
}

const expenseSchema = z.object({
  kind: z.literal("expense"),
  currency: z.literal("MULTI"),
  color: z.string({ required_error: "required" })
    .max(10, { message: "invalid" }),
  icon: z.nativeEnum(ICONS, { required_error: "required", message: "invalid option" }),
  name: z.string({ required_error: "required" })
    .max(NAME_MAX_LENGTH, { message: "too long" })
    .min(NAME_MIN_LENGTH, { message: "too short" }),
  description: z.string()
    .max(DESCRIPTION_MAX_LENGTH, { message: "too long" })
    .nullish(),
  subcategories: z.array(
    z.object({
      kind: z.literal("expense"),
      icon: z.nativeEnum(ICONS, { required_error: "required", message: "invalid option" }),
      name: z.string({ required_error: "required" })
        .max(NAME_MAX_LENGTH, { message: "too long" })
        .min(NAME_MIN_LENGTH, { message: "too short" }),
      description: z.string()
        .max(DESCRIPTION_MAX_LENGTH, { message: "too long" })
        .nullish(),
      intent: z.literal("create")
    })
  ),
  intent: z.literal("create")
})

const incomeSchema = z.object({
  kind: z.literal("income"),
  currency: z.literal("MULTI"),
  color: z.string({ required_error: "required" })
    .max(10, { message: "invalid" }),
  icon: z.nativeEnum(ICONS, { required_error: "required", message: "invalid option" }),
  name: z.string({ required_error: "required" })
    .max(NAME_MAX_LENGTH, { message: "too long" })
    .min(NAME_MIN_LENGTH, { message: "too short" }),
  description: z.string()
    .max(DESCRIPTION_MAX_LENGTH, { message: "too long" })
    .nullish(),
  subcategories: z.array(
    z.object({
      kind: z.literal("income"),
      icon: z.nativeEnum(ICONS, { required_error: "required", message: "invalid option" }),
      name: z.string({ required_error: "required" })
        .max(NAME_MAX_LENGTH, { message: "too long" })
        .min(NAME_MIN_LENGTH, { message: "too short" }),
      description: z.string()
        .max(DESCRIPTION_MAX_LENGTH, { message: "too long" })
        .nullish(),
      intent: z.literal("create")
    })
  ),
  intent: z.literal("create")
})

const schema = z.union([expenseSchema, incomeSchema])

type Props = { kind: Kind }

export function FormCreateTemplate({ kind, ...props }: ComponentProps<"form"> & Props) {
  const fetcher = useFetcher()

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      kind,
      currency: "MULTI",
      color: DEFAULT_COLORS[kind],
      icon: DEFAULT_ICONS[kind],
      name: DEFAULT_NAMES[kind],
      description: null,
      subcategories: [],
      intent: "create",
    }
  })

  useEffect(() => {
    form.reset()
    form.setValue("kind", kind)
  }, [kind])

  useEffect(() => {
    if (Object.keys(form.formState.errors).length === 0) return

    console.error(form.formState.errors)
  }, [form.formState.errors])

  const formColor = form.watch("color")

  const onSubmit = async (values: z.infer<typeof schema>) => {
    const promise = fetcher.submit({ ...values }, { method: "post", encType: "application/json" })

    toast.promise(
      promise,
      {
        loading: "Creating...",
        success: () => `${values.name} account created!`,
        error: `Couldn't save ${values.name}, something went wrong`
      }
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
        className={cn(
          "overflow-auto flex flex-col gap-2 px-1 no-scrollbar relative",
          props.className
        )}
        id="account-form"
      >
        <div
          className="grid sticky top-0 grid-rows-2 min-h-42 h-42 gap-2 rounded-lg shadow-xs p-4 z-40"
          style={{ backgroundColor: formColor }}
        >
          <div className="flex gap-2 items-start">
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
                {"Create Category"}
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
      </form>
    </Form>
  )
}