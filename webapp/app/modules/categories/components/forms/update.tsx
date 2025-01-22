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
import { isExpense } from "~/shared/types/account";
import { Icon, ICONS } from "~/shared/types/icon";
import {
  ArchiveAction,
  DeleteAction,
  OnSubmitUpdateAction,
  UnarchiveAction
} from "../../types/actions";
import { defaultIcons } from "../../types/icons";
import { Account } from "../../types/preview";
import { PreviewCard } from "../child/preview-card";
import { schema } from "../schemas/update";
import { ChildForm } from "./child/edit";

type Props = {
  category: Account
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmitAction: OnSubmitUpdateAction
  onDeleteAction: DeleteAction
  onArchiveAction: ArchiveAction
  onUnarchiveAction: UnarchiveAction
  submitting: boolean
}

interface Child {
  id: number
  name: string
  description?: string
  icon: Icon
  archivedAt?: string
}

interface State {
  data: Child
  onSubmit: (data: Child) => void
  open: boolean
  action: "add" | "edit"
  submitting: boolean
}

interface InitialState {
  id?: number
  name?: string
  description?: string
  icon: Icon
}

const __actions = {
  ADD: "ADD",
  EDIT: "EDIT",
  CLOSE: "CLOSE",
  OPEN_CHANGED: "OPEN_CHANGED"
} as const

type Actions = typeof __actions

type Action =
  { type: Actions["ADD"], onSubmit: (data: Child) => void } |
  { type: Actions["EDIT"], data: Child, onSubmit: (data: Child) => void } |
  { type: Actions["CLOSE"] } |
  { type: Actions["OPEN_CHANGED"], open: boolean }

function reducer(state: State, action: Action): State {
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

function init({ id = -1, name = "", description, icon }: InitialState): State {
  return {
    data: { id, name, description, icon },
    onSubmit: (__data) => { },
    open: false,
    action: "add",
    submitting: false,
  }
}

export function UpdateCategory({
  category,
  open,
  onOpenChange,
  onSubmitAction,
  onDeleteAction,
  onArchiveAction,
  onUnarchiveAction,
  submitting
}: Props) {
  const [state, dispatch] = useReducer(reducer, { icon: defaultIcons[category.kind] }, init)

  const onOpenFormChange = (open: boolean) =>
    dispatch({ type: "OPEN_CHANGED", open })
  const onChildClick = (payload: { data: Child, onSubmit: (data: Child) => void }) =>
    dispatch({ type: "EDIT", ...payload })
  const onAddClick = (payload: { onSubmit: (data: Child) => void }) =>
    dispatch({ type: "ADD", ...payload })

  const onFormSubmitted = () =>
    dispatch({ type: "CLOSE" })

  return (
    <>
      <Drawer modal open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="overflow-clip">
          <DrawerHeader>
            <DrawerTitle>
              New {kindToHuman(category.kind)} Category
            </DrawerTitle>
          </DrawerHeader>
          <UpdateForm
            category={category}
            onSubmitAction={onSubmitAction}
            onDeleteAction={onDeleteAction}
            onArchiveAction={onArchiveAction}
            onUnarchiveAction={onUnarchiveAction}
            submitting={submitting || state.submitting}
            onChildClick={onChildClick}
            onAddChildClick={onAddClick}
            onFormSubmitted={onFormSubmitted}
          />
        </DrawerContent>
      </Drawer>

      <ChildForm
        action={state.action}
        child={state.data}
        open={state.open}
        onSubmit={state.onSubmit}
        onOpenChange={onOpenFormChange}
        defaultIcon={defaultIcons[category.kind]}
      />
    </>
  )
}

type FormProps = {
  category: Account
  onSubmitAction: OnSubmitUpdateAction
  onDeleteAction: DeleteAction
  onArchiveAction: ArchiveAction
  onUnarchiveAction: UnarchiveAction
  onChildClick: (payload: { data: Child, onSubmit: (data: Child) => void }) => void
  onAddChildClick: (payload: { onSubmit: (data: Child) => void }) => void
  onFormSubmitted: () => void
  submitting: boolean
}

function UpdateForm({
  category,
  onSubmitAction,
  onChildClick,
  onAddChildClick,
  onFormSubmitted,
  submitting
}: FormProps) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: category.id,
      currency: category.currency,
      name: category.name,
      description: category.description ?? undefined,
      color: category.color,
      icon: category.icon,
      children: category.children.map((child) => ({
        id: child.id,
        name: child.name,
        description: child.description ?? undefined,
        icon: child.icon,
        archivedAt: child.archivedAt || undefined,
      })),
      intent: "update"
    }
  })
  const { fields: children, append, update } = useFieldArray({
    name: "children",
    control: form.control,
    keyName: "identity"
  })

  const onSubmit = async (values: z.infer<typeof schema>) =>
    await onSubmitAction({ ...values })

  return (
    <>
      <DrawerHeader>
        <DrawerTitle>
          {isExpense(category.kind) ? "Update Expense Category" : "Update Income Category"}
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
              variant="outline"
              type="button"
              onClick={() => onAddChildClick({
                onSubmit: (data) => {
                  append({ ...data })
                  onFormSubmitted()
                }
              })}
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
                  onClick={() => onChildClick({
                    data: { ...c },
                    onSubmit: (data) => {
                      update(idx, { ...data })
                      onFormSubmitted()
                    }
                  })}
                />
              ))}
            </div>
          </div>
          <DrawerFooter>
            <Button type="submit" className="min-w-24" disabled={submitting}>
              {submitting ? <Throbber size={"sm"} /> : "Update"}
            </Button>
            <DrawerClose asChild>
              <Button variant={"outline"} disabled={submitting}>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </Form>
    </>
  )
}