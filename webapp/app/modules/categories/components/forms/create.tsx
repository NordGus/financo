import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useReducer } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { CurrencyInput } from "~/modules/shared/components/inputs/currency-input";
import { IconInput } from "~/modules/shared/components/inputs/icon-input";
import { Throbber } from "~/modules/shared/components/throbber";
import { Button } from "~/modules/shared/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "~/modules/shared/components/ui/drawer";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "~/modules/shared/components/ui/form";
import { Input } from "~/modules/shared/components/ui/input";
import { Textarea } from "~/modules/shared/components/ui/textarea";
import { accountKindToHuman as kindToHuman } from "~/modules/shared/helpers/account-kind-to-human";
import { Currency } from "~/modules/shared/types/currency";
import { Icon } from "~/modules/shared/types/icon";
import { schema } from "../../schemas/create";
import { ModuleKind } from "../../types/category";
import { OnSubmitCreateAction } from "../../types/create";
import { defaultIcons } from "../../types/icons";
import { PreviewCard } from "../child/preview-card";
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
  open: boolean
  action: "add" | "edit"
  onSubmit: (data: ChildData) => void
  onDelete: () => void
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
  { type: ChildActions["EDIT"], data: ChildData, onSubmit: (data: ChildData) => void, onDelete: () => void } |
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
        action: "edit",
        open: true,
        onSubmit: action.onSubmit,
        onDelete: action.onDelete,
      }
    case "CLOSE":
      return {
        ...state,
        data: { name: "", description: undefined, icon: action.icon },
        open: false,
        onSubmit: (__data) => { },
        onDelete: () => { },
      }
    case "OPEN_CHANGED":
      return {
        ...state,
        open: action.open,
        onSubmit: (__data) => { },
        onDelete: () => { },
      }
    default:
      throw new Error(`ChildForm invalid action`)
  }
}

function initChildForm({ name = "", description, icon }: ChildInitialState): ChildState {
  return {
    data: { name, description, icon },
    open: false,
    action: "add",
    onSubmit: (__data) => { },
    onDelete: () => { },
  }
}

function CreateForm({ kind, defaultCurrency, onSubmitAction, submitting }: FormProps) {
  const [child, childDispatch] = useReducer(reducer, { icon: defaultIcons[kind] }, initChildForm)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      kind: kind,
      color: {
        expense: "#db002b",
        income: "#0ef23f"
      }[kind],
      currency: defaultCurrency,
      icon: defaultIcons[kind],
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
      },
      onDelete: () => {
        onChildSubmitted()
        remove(idx)
      },
    })

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
                      placeholder="You can add a little extra information about this Category."
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
                    The currency this category will operate in with
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
            <div className="space-y-2">
              {children.map((c, idx) => (
                <PreviewCard
                  key={`child.${idx}`}
                  name={c.name}
                  description={c.description}
                  icon={c.icon}
                  onClick={() => onEditChildClick(c, idx)}
                  archived={false}
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
        defaultIcon={defaultIcons[kind]}
        open={child.open}
        onOpenChange={onChildOpenChanged}
        onSubmit={child.onSubmit}
        onDelete={child.onDelete}
      />
    </>
  )
}