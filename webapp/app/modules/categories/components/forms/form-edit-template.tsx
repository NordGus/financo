import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, Package, PackageOpen, Plus, Save, Trash, Undo2 } from "lucide-react"
import { ComponentProps, Fragment, useEffect } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { useFetcher } from "react-router"
import { toast } from "sonner"
import { z } from "zod"
import { cn } from "~/lib/utils"
import { InfoDialog } from "~/modules/shared/components/dialogs/info"
import { ColorInput } from "~/modules/shared/components/inputs/color-input"
import { IconInput } from "~/modules/shared/components/inputs/icon-input"
import { Throbber } from "~/modules/shared/components/throbber"
import { Alert, AlertDescription, AlertTitle } from "~/modules/shared/components/ui/alert"
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
import { archivedCategoriesManual } from "../../manual/archived-categories-manual"
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
  archived: boolean
}

type Props = {
  kind: Kind
  color: string
  icon: Icon
  name: string
  description: string | undefined | null
  archived: boolean
  subcategories: SubcategoryProps[]
}

export function FormEditTemplate({
  kind,
  color,
  icon,
  name,
  description,
  archived,
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
    form.reset({
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
      intent: "update"
    })
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
        {
          archived && (
            <Alert>
              <AlertCircle className="size-4" />
              <AlertTitle className="mb-2">
                {"This Category is archived!"}
              </AlertTitle>
              <AlertDescription className="text-xs">
                {archivedCategoriesManual.message}
              </AlertDescription>
            </Alert>
          )
        }
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
        <Separator className="mb-1" />
        <Button
          variant={"outline"}
          className="w-full"
          type="button"
          onClick={() => append({
            icon: formIcon,
            name: DEFAULT_SUBCATEGORY_NAMES[kind],
            intent: "create",
          })}
          disabled={archived}
        >
          <Plus /> {"Add Subcategory"}
        </Button>
        {
          subcategoriesFields.length > 0 && (
            <Separator className="my-1" />
          )
        }
        {
          subcategoriesFields.map((subcategory, index) => {
            const data = subcategories.at(index)
            const intent = form.watch(`subcategories.${index}.intent`)

            return (
              <Fragment key={`subcategory.${subcategory.id}`}>
                {
                  data?.archived && !archived && (
                    <InfoDialog
                      withTitleInButton
                      copy={{
                        title: "This Subcategory is archived!",
                        message: archivedCategoriesManual.message
                      }}
                      variant={"outline"}
                      size={"default"}
                    />
                  )
                }
                {
                  intent === "destroy" && (
                    <InfoDialog
                      withTitleInButton
                      copy={{
                        title: "This Subcategory is marked for deletion!",
                        message: (
                          <>
                            <p>{`This action is irreversible. It will also delete all transaction(s) related to this Subcategory. It will take effect once you save its parent Category.`}</p>
                          </>
                        )
                      }}
                      variant={"outline"}
                      size={"default"}
                    />
                  )
                }
                {
                  intent === "archive" && !data?.archived && !archived && (
                    <InfoDialog
                      withTitleInButton
                      copy={{
                        title: "This Subcategory is marked for archival!",
                        message: (
                          <>
                            <p>{`This action can be reversed. It does not delete any transaction(s) related to this Subcategory. It will take effect once you save its parent Category.`}</p>
                          </>
                        )
                      }}
                      variant={"outline"}
                      size={"default"}
                    />
                  )
                }
                {
                  intent === "unarchive" && data?.archived && !archived && (
                    <InfoDialog
                      withTitleInButton
                      copy={{
                        title: "This Subcategory is marked for unarchival!",
                        message: (
                          <>
                            <p>{`This action can be reversed. It does not delete any transaction(s) related to this Subcategory. It will take effect once you save its parent Category.`}</p>
                          </>
                        )
                      }}
                      variant={"outline"}
                      size={"default"}
                    />
                  )
                }
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
                <div className="flex items-center gap-2 justify-end">
                  {
                    data && data.archived && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            onClick={() => {
                              form.setValue(
                                `subcategories.${index}.intent`,
                                intent === "unarchive" ? "update" : "unarchive"
                              )
                            }}
                            disabled={archived}
                          >
                            {
                              intent === "unarchive"
                                ? <Undo2 />
                                : <PackageOpen />
                            }
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {
                            intent === "unarchive"
                              ? "Unmark Subcategory for unarchival"
                              : "Mark Subcategory for unarchival"
                          }
                        </TooltipContent>
                      </Tooltip>
                    )
                  }
                  {
                    data && !data.archived && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            onClick={() => {
                              form.setValue(
                                `subcategories.${index}.intent`,
                                intent === "archive" ? "update" : "archive"
                              )
                            }}
                            disabled={archived}
                          >
                            {
                              intent === "archive"
                                ? <Undo2 />
                                : <Package />
                            }
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {
                            intent === "archive"
                              ? "Unmark Subcategory for archival"
                              : "Mark Subcategory for archival"
                          }
                        </TooltipContent>
                      </Tooltip>
                    )
                  }
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={"destructive"}
                        type="button"
                        onClick={() => {
                          if (subcategory.id) {
                            form.setValue(
                              `subcategories.${index}.intent`,
                              intent === "destroy" ? "update" : "destroy"
                            )
                          } else remove(index)
                        }}
                      >
                        {
                          data
                            ? intent === "destroy"
                              ? <Undo2 />
                              : <Trash />
                            : <Trash />
                        }
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {
                        intent === "destroy"
                          ? "Unmark Subcategory for deletion"
                          : data
                            ? "Mark Subcategory for deletion"
                            : "Remove Subcategory"
                      }
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Separator className="my-1" />
              </Fragment>
            )
          })
        }
        {
          subcategoriesFields.length > 1 && (
            <Button
              variant={"outline"}
              className="w-full"
              type="button"
              onClick={() => append({
                icon: formIcon,
                name: DEFAULT_SUBCATEGORY_NAMES[kind],
                intent: "create",
              })}
              disabled={archived}
            >
              <Plus /> {"Add Subcategory"}
            </Button>
          )
        }
      </form>
    </Form>
  )
}