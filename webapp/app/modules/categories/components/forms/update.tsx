import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useEffect, useReducer, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useFetcher } from "react-router";
import { z } from "zod";
import { CurrencyInput } from "~/shared/components/inputs/currency-input";
import { IconInput } from "~/shared/components/inputs/icon-input";
import { Throbber } from "~/shared/components/throbber";
import { Button } from "~/shared/components/ui/button";
import { DrawerClose, DrawerFooter, DrawerHeader, DrawerTitle } from "~/shared/components/ui/drawer";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "~/shared/components/ui/form";
import { Input } from "~/shared/components/ui/input";
import { Textarea } from "~/shared/components/ui/textarea";
import { isCategory, isExpense } from "~/shared/types/account";
import { Icon, ICONS } from "~/shared/types/icon";
import { Created } from "../../types/create";
import { Account } from "../../types/preview";
import { Preview } from "../preview/child/edit";
import { schema } from "../schemas/update";
import { ChildForm } from "./child/edit";

interface Props {
  account: Account
  onSuccess: () => void
}

interface ChildData {
  id: number
  name: string
  description?: string
  icon: Icon
}

interface ChildState {
  data: ChildData
  onSubmit: (data: ChildData) => void
  open: boolean
  action: "add" | "edit"
}

interface ChildInitialState {
  id?: number
  name?: string
  description?: string
  icon?: Icon
}

const __childAction = {
  ADD: "ADD",
  EDIT: "EDIT",
  CLOSE: "CLOSE",
  OPEN_CHANGED: "OPEN_CHANGED"
} as const

type ChildActions = typeof __childAction

type ChildAction =
  { type: ChildActions["ADD"], onSubmit: (data: ChildData) => void } |
  { type: ChildActions["EDIT"], data: ChildData, onSubmit: (data: ChildData) => void } |
  { type: ChildActions["CLOSE"] } |
  { type: ChildActions["OPEN_CHANGED"], open: boolean }

function reducer(state: ChildState, action: ChildAction): ChildState {
  switch (action.type) {
    case "ADD":
      return {
        ...state,
        data: { id: -1, name: "", description: undefined, icon: ICONS.bookmark },
        onSubmit: action.onSubmit,
        action: "add",
        open: true
      }
    case "EDIT":
      return {
        ...state,
        data: { ...action.data },
        onSubmit: action.onSubmit,
        action: "edit",
        open: true
      }
    case "CLOSE":
      return {
        ...state,
        data: { id: -1, name: "", description: undefined, icon: ICONS.bookmark },
        onSubmit: (__data) => { },
        open: false
      }
    case "OPEN_CHANGED":
      return { ...state, onSubmit: (__data) => { }, open: action.open }
    default:
      throw new Error(`ChildForm invalid action`)
  }
}

function initChildForm({ id = -1, name = "", description, icon = ICONS.bookmark }: ChildInitialState): ChildState {
  return {
    data: { id, name, description, icon },
    onSubmit: (__data) => { },
    open: false,
    action: "add"
  }
}

export function UpdateCategory({ account, onSuccess }: Props) {
  if (!isCategory(account.kind)) throw new Error(`CreateCategory invalid kind ${account.kind}`)

  const [loading, setLoading] = useState(false)
  const [child, childDispatch] = useReducer(reducer, {}, initChildForm)
  const fetcher = useFetcher<Created | null>({ key: `categories.create.${account.kind}` })
  const defaultIcon = isExpense(account.kind) ? ICONS.bookmark : ICONS.banknote
  const buildPreviewData = (data: ChildData) => {
    const child = account.children.find((c) => c.id === data.id)

    return { ...data, archivedAt: child?.archivedAt, transactions: child?.transactions }
  }

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: account.id,
      currency: account.currency,
      name: account.name,
      description: account.description ?? undefined,
      color: account.color,
      icon: account.icon,
      children: account.children.map((child) => ({
        id: child.id,
        name: child.name,
        description: child.description ?? undefined,
        icon: child.icon,
      })),
      intent: "update"
    }
  })
  const { fields: children, append, update, remove } = useFieldArray({
    name: "children",
    control: form.control,
    keyName: "identity"
  })

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setLoading(true)

    await fetcher.submit(
      values,
      { action: `/categories/${account.id}`, method: "post", encType: "application/json" }
    )
  }

  const onChildOpenChanged = (open: boolean) => childDispatch({ type: "OPEN_CHANGED", open })
  const onChildSubmitted = () => childDispatch({ type: "CLOSE" })
  const onAddChildClicked = () => childDispatch({
    type: "ADD",
    onSubmit: (data) => {
      append({ ...data })

      onChildSubmitted()
    }
  })
  const onEditChildClicked = (c: ChildData, idx: number) => childDispatch({
    type: "EDIT",
    data: { id: c.id, name: c.name, description: c.description ?? undefined, icon: c.icon },
    onSubmit: (data) => {
      update(idx, { ...data })
      onChildSubmitted()
    }
  })

  useEffect(() => {
    setLoading(false)

    if (loading && fetcher.data) onSuccess()
  }, [fetcher.data])

  return (
    <>
      <DrawerHeader>
        <DrawerTitle>
          {isExpense(account.kind) ? "Update Expense Category" : "Update Income Category"}
        </DrawerTitle>
      </DrawerHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-h-[85dvh] overflow-auto">
          <div className="flex flex-col gap-4 px-4">
            <div className="grid grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <IconInput
                        value={field.value}
                        onChange={field.onChange}
                        entity="category"
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
                  <FormItem className="col-span-3">
                    <FormLabel>Color</FormLabel>
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="You can add a little extra information about this Account."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    You can leave this empty
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <CurrencyInput onValueChange={field.onChange} defaultValue={field.value} />
                  <FormDescription>
                    The currency this account will operate in with
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              variant="link"
              type="button"
              className="flex justify-center items-center leading-snug gap-2 border-2 border-dashed rounded-md"
              onClick={onAddChildClicked}
            >
              <PlusIcon /> Add Child
            </Button>
            <div className="divide-y-2 divide-primary-foreground">
              {children.map((c, idx) => (
                <Preview
                  key={`child.${idx}`}
                  child={buildPreviewData(c)}
                  onEditClick={() => onEditChildClicked(c, idx)}
                  onDeleteSuccess={() => remove(idx)}
                />
              ))}
            </div>
          </div>
          <DrawerFooter>
            <Button type="submit" className="min-w-24" disabled={loading}>
              {loading ? <Throbber size={"sm"} /> : "Update"}
            </Button>
            <DrawerClose asChild>
              <Button variant={"outline"}>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </Form>

      <ChildForm
        action={child.action}
        child={child.data}
        open={child.open}
        onSubmit={child.onSubmit}
        onOpenChange={onChildOpenChanged}
        defaultIcon={defaultIcon}
      />
    </>
  )
}