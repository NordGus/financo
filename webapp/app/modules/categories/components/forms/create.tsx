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
import { isCategory, isExpense, Kind } from "~/shared/types/account";
import { Currency } from "~/shared/types/currency";
import { Icon, ICONS } from "~/shared/types/icon";
import { Created } from "../../types/create";
import { Preview } from "../preview/child/create";
import { schema } from "../schemas/create";
import { ChildForm } from "./child/create";

interface Props {
  kind: Kind
  defaultCurrency: Currency
  onSuccess: () => void
}

interface ChildData {
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
        data: { name: "", description: undefined, icon: ICONS.bookmark },
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
        data: { name: "", description: undefined, icon: ICONS.bookmark },
        onSubmit: (__data) => { },
        open: false
      }
    case "OPEN_CHANGED":
      return { ...state, onSubmit: (__data) => { }, open: action.open }
    default:
      throw new Error(`ChildForm invalid action`)
  }
}

function initChildForm({ name = "", description, icon = ICONS.bookmark }: ChildInitialState): ChildState {
  return {
    data: { name, description, icon },
    onSubmit: (__data) => { },
    open: false,
    action: "add"
  }
}

export function CreateCategory({ kind, defaultCurrency, onSuccess }: Props) {
  if (!isCategory(kind)) throw new Error(`CreateCategory invalid kind ${kind}`)

  const [loading, setLoading] = useState(false)
  const [child, childDispatch] = useReducer(reducer, {}, initChildForm)
  const fetcher = useFetcher<Created | null>({ key: `categories.create.${kind}` })
  const defaultIcon = isExpense(kind) ? ICONS.bookmark : ICONS.banknote

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      kind: kind,
      currency: defaultCurrency,
      icon: defaultIcon,
      intent: "create"
    }
  })
  const { fields: children, append, update } = useFieldArray({
    name: "children",
    control: form.control,
    keyName: "identity"
  })

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setLoading(true)

    await fetcher.submit(
      values,
      { action: "/categories", method: "post", encType: "application/json" }
    )
  }

  const onChildOpenChanged = (open: boolean) => childDispatch({ type: "OPEN_CHANGED", open })
  const onChildSubmitted = () => childDispatch({ type: "CLOSE" })
  const onAddChildClicked = () => childDispatch({
    type: "ADD",
    onSubmit: (data) => {
      append({ name: data.name, description: data.description, icon: data.icon })

      onChildSubmitted()
    }
  })
  const onEditChildClicked = (c: ChildData, idx: number) => childDispatch({
    type: "EDIT",
    data: { name: c.name, description: c.description, icon: c.icon },
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
          {isExpense(kind) ? "Create Expense Category" : "Create Income Category"}
        </DrawerTitle>
      </DrawerHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-h-[85dvh] overflow-auto">
          <div className="flex flex-col gap-4 px-4">
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <IconInput value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem className="col-span-2">
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
                  name={c.name}
                  description={c.description}
                  icon={c.icon}
                  onClick={() => onEditChildClicked(c, idx)}
                />
              ))}
            </div>
          </div>
          <DrawerFooter>
            <Button type="submit" className="min-w-24" disabled={loading}>
              {loading ? <Throbber size={"sm"} /> : "Create"}
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