import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Save, Trash } from "lucide-react"
import { ComponentProps, Fragment, useEffect } from "react"
import { useFieldArray, useForm } from "react-hook-form"
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
import { Separator } from "~/modules/shared/components/ui/separator"
import { Textarea } from "~/modules/shared/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "~/modules/shared/components/ui/tooltip"
import {
  Kinds
} from "~/modules/shared/types/account"
import { Icon } from "~/modules/shared/types/icon"
import { DESCRIPTION_MAX_LENGTH, NAME_MAX_LENGTH } from "../../schemas/constants"
import { schema } from "../../schemas/update"

export type Kind = Kinds["expense"] | Kinds["income"]

const DEFAULT_SUBCATEGORY_NAMES: Record<Kind, string> = {
  expense: "New Expense Subcategory",
  income: "New Income Subcategory"
}

type SubcategoryProps = {
  id: number
  icon: Icon
  name: string
  description: string | undefined | null
}

type Props = {
  kind: Kind
  color: string
  icon: Icon
  name: string
  description: string | undefined | null
  subcategories: SubcategoryProps[]
}

export function FormCreateTemplate({
  kind,
  color,
  icon,
  name,
  description,
  subcategories,
  ...props
}: ComponentProps<"form"> & Props) {
  const fetcher = useFetcher()

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      kind,
      color,
      icon,
      name,
      description,
      subcategories: subcategories.map(subcategory => ({
        id: subcategory.id,
        icon: subcategory.icon,
        name: subcategory.name,
        description: subcategory.description,
        intent: "update" as const
      })),
      intent: "update",
    }
  })

  useEffect(() => {
    form.setValue("kind", kind)
    form.setValue("color", color)
    form.setValue("icon", icon)
    form.setValue("name", name)
    form.setValue("description", description)
    form.setValue(
      "subcategories",
      subcategories.map(subcategory => ({
        id: subcategory.id,
        icon: subcategory.icon,
        name: subcategory.name,
        description: subcategory.description,
        intent: "update" as const
      }))
    )
  }, [
    kind,
    color,
    icon,
    name,
    description,
    // This feels like a hack but it works.
    subcategories.map(subcategory => Object.values(subcategory).join(",")).join(","),
  ])

  useEffect(() => {
    if (Object.keys(form.formState.errors).length === 0) return

    console.error(form.formState.errors)
  }, [form.formState.errors])

  const formColor = form.watch("color")
  const formIcon = form.watch("icon")

  const {
    fields: subcategoriesFields,
    append,
    remove,
  } = useFieldArray({ name: "subcategories", control: form.control, keyName: "identity" })

  const onSubmit = async (values: z.infer<typeof schema>) => {
    const promise = fetcher.submit(
      {
        ...values,
        description: values.description ?? null,
        subcategories: values.subcategories.map(subcategory => ({
          ...subcategory,
          id: subcategory.id ?? null,
          description: subcategory.description ?? null,
        }))
      },
      { method: "post", encType: "application/json" }
    )

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
        <Separator className="mb-2" />
        {
          subcategoriesFields.length >= 2 && (
            <>
              <Button
                variant={"outline"}
                className="w-full"
                type="button"
                onClick={() => append({
                  icon: formIcon,
                  name: DEFAULT_SUBCATEGORY_NAMES[kind],
                  intent: "create",
                })}
              >
                <Plus /> {"Add Subcategory"}
              </Button>
              <Separator className="my-2" />
            </>
          )
        }
        {
          subcategoriesFields.map((subcategory, index) => (
            <Fragment key={`subcategory.${subcategory.id}`}>
              <div className="flex flex-col gap-2">
                <div className="grid gap-2 grid-cols-[min-content_1fr]">
                  <FormField
                    control={form.control}
                    name={`subcategories.${index}.icon`}
                    render={({ field }) => (
                      <FormItem>
                        <IconInput
                          value={field.value}
                          onChange={field.onChange}
                          color={formColor}
                          withColorBackground
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`subcategories.${index}.name`}
                    render={({ field }) => {
                      const charCount = field.value?.length ?? 0
                      const isApproachingLimit = charCount >= NAME_MAX_LENGTH * 0.9
                      const isAboveLimit = charCount > NAME_MAX_LENGTH

                      return (
                        <FormItem className="grow">
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
                </div>
                <FormField
                  control={form.control}
                  name={`subcategories.${index}.description`}
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
                            placeholder="You can add a little extra information about this Subcategory..."
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
              </div>
              <div className="flex items-center justify-end">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={"destructive"}
                      type="button"
                      onClick={() => remove(index)}
                    >
                      <Trash />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {"Remove Subcategory"}
                  </TooltipContent>
                </Tooltip>
              </div>
              <Separator className="my-2" />
            </Fragment>
          ))
        }
        <Button
          variant={"outline"}
          className="w-full"
          type="button"
          onClick={() => append({
            icon: formIcon,
            name: DEFAULT_SUBCATEGORY_NAMES[kind],
            intent: "create",
          })}
        >
          <Plus /> {"Add Subcategory"}
        </Button>
      </form>
    </Form>
  )
}