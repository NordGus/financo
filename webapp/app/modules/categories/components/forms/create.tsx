import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useReducer } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { CurrencyInput } from "~/shared/components/inputs/currency-input";
import { IconInput } from "~/shared/components/inputs/icon-input";
import { Throbber } from "~/shared/components/throbber";
import { Button } from "~/shared/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "~/shared/components/ui/drawer";
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
import { accountKindToHuman as kindToHuman } from "~/shared/helpers/account-kind-to-human";
import { Currency } from "~/shared/types/currency";
import { Icon } from "~/shared/types/icon";
import { ModuleKind } from "../../types/account";
import { OnSubmitCreateAction } from "../../types/actions";
import { defaultIcons } from "../../types/icons";
import { PreviewCard } from "../child/preview-card";
import { schema } from "../schemas/create";
import { ChildForm } from "./child/create";

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  kind: ModuleKind
  defaultCurrency: Currency
  onSubmitAction: OnSubmitCreateAction
  submitting: boolean
}

export function CreateCategory({ open, onOpenChange, defaultCurrency, kind, submitting, onSubmitAction }: Props) {
  return (
    <Drawer modal open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="overflow-clip">
        <DrawerHeader>
          <DrawerTitle>
            New {kindToHuman(kind)} Category
          </DrawerTitle>
        </DrawerHeader>
        <CreateForm
          kind={kind}
          defaultCurrency={defaultCurrency}
          onSubmitAction={onSubmitAction}
          submitting={submitting}
        />
      </DrawerContent>
    </Drawer>
  )
}

interface FormProps {
  kind: ModuleKind
  defaultCurrency: Currency
  onSubmitAction: OnSubmitCreateAction
  submitting: boolean
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
  icon: Icon
}

const __childAction = {
  ADD: "ADD",
  EDIT: "EDIT",
  CLOSE: "CLOSE",
  OPEN_CHANGED: "OPEN_CHANGED"
} as const

type ChildActions = typeof __childAction

type ChildAction =
  { type: ChildActions["ADD"], onSubmit: (data: ChildData) => void, icon: Icon } |
  { type: ChildActions["EDIT"], data: ChildData, onSubmit: (data: ChildData) => void } |
  { type: ChildActions["CLOSE"], icon: Icon } |
  { type: ChildActions["OPEN_CHANGED"], open: boolean }

function reducer(state: ChildState, action: ChildAction): ChildState {
  switch (action.type) {
    case "ADD":
      return {
        ...state,
        data: { name: "", description: undefined, icon: action.icon },
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
        data: { name: "", description: undefined, icon: action.icon },
        onSubmit: (__data) => { },
        open: false
      }
    case "OPEN_CHANGED":
      return { ...state, onSubmit: (__data) => { }, open: action.open }
    default:
      throw new Error(`ChildForm invalid action`)
  }
}

function initChildForm({ name = "", description, icon }: ChildInitialState): ChildState {
  return {
    data: { name, description, icon },
    onSubmit: (__data) => { },
    open: false,
    action: "add"
  }
}

function CreateForm({ kind, defaultCurrency, onSubmitAction, submitting }: FormProps) {
  const [child, childDispatch] = useReducer(reducer, { icon: defaultIcons[kind] }, initChildForm)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      kind: kind,
      color: {
        external_expense: "#db002b",
        external_income: "#0ef23f"
      }[kind],
      currency: defaultCurrency,
      icon: defaultIcons[kind],
      intent: "create"
    }
  })
  const { fields: children, append, update, remove } = useFieldArray({
    name: "children",
    control: form.control,
    keyName: "identity"
  })

  const onSubmit = async (values: z.infer<typeof schema>) =>
    onSubmitAction({ ...values })

  const onChildOpenChanged = (open: boolean) =>
    childDispatch({ type: "OPEN_CHANGED", open })
  const onChildSubmitted = () =>
    childDispatch({ type: "CLOSE", icon: defaultIcons[kind] })
  const onAddChildClick = () =>
    childDispatch({
      type: "ADD",
      onSubmit: (data) => {
        append({ name: data.name, description: data.description, icon: data.icon })

        onChildSubmitted()
      },
      icon: defaultIcons[kind],
    })
  const onEditChildClick = (c: ChildData, idx: number) =>
    childDispatch({
      type: "EDIT",
      data: { name: c.name, description: c.description, icon: c.icon },
      onSubmit: (data) => {
        update(idx, { ...data })

        onChildSubmitted()
      }
    })
  const onDeleteChildClick = (idx: number) => remove(idx)

  return (
    <>
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
              variant="outline"
              type="button"
              onClick={onAddChildClick}
            >
              <PlusIcon /> Add Child
            </Button>
            <div className="divide-y-2 divide-primary-foreground">
              {children.map((c, idx) => (
                <PreviewCard
                  key={`child.${idx}`}
                  name={c.name}
                  description={c.description}
                  icon={c.icon}
                  onEditClick={() => onEditChildClick(c, idx)}
                  onDeleteClick={() => onDeleteChildClick(idx)}
                  onArchiveClick={() => { }}
                  onUnarchiveClick={() => { }}
                  submitting={false}
                  create
                />
              ))}
            </div>
          </div>
          <DrawerFooter>
            <Button type="submit" className="min-w-24" disabled={submitting}>
              {submitting ? <Throbber size={"sm"} /> : "Create"}
            </Button>
            <DrawerClose asChild disabled={submitting}>
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
        defaultIcon={defaultIcons[kind]}
      />
    </>
  )
}