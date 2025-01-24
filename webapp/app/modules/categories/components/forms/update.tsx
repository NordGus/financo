import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useReducer } from "react";
import { useForm } from "react-hook-form";
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
import { Icon, ICONS } from "~/shared/types/icon";
import {
  ArchiveAction,
  DeleteAction,
  OnSubmitUpdateAction,
  UnarchiveAction
} from "../../types/actions";
import { Category } from "../../types/category";
import { defaultIcons } from "../../types/icons";
import { PreviewCard } from "../child/preview-card";
import { schema } from "../schemas/update";
import { ChildForm as CreateChild } from "./child/create";
import { ChildForm as UpdateChild } from "./child/update";

type Props = {
  category: Category
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmitAction: OnSubmitUpdateAction
  onDeleteAction: DeleteAction
  onArchiveAction: ArchiveAction
  onUnarchiveAction: UnarchiveAction
  submitting: boolean
}

type Child = {
  name: string
  description?: string
  icon: Icon
  archivedAt?: string
}

type Open = "update" | "create" | "delete" | "archive" | "unarchive" | null

type State = {
  data: Child
  onSubmit: (data: Child) => void
  open: Open
  submitting: boolean
}

type InitialState = {
  id?: number
  name?: string
  description?: string
  icon: Icon
}

type OnSubmit = (data: Child) => void
type OnChildClick = (payload: { data: Child, onSubmit: (data: Child) => void }) => void
type OnAddChildClick = () => void

const __actions = {
  ADD: "ADD",
  UPDATE: "UPDATE",
  CLOSE: "CLOSE",
  OPEN_CHANGED: "OPEN_CHANGED"
} as const

type Actions = typeof __actions

type Action =
  { type: Actions["ADD"] } |
  { type: Actions["UPDATE"], data: Child, onSubmit: OnSubmit } |
  { type: Actions["CLOSE"] } |
  { type: Actions["OPEN_CHANGED"], open: Open }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD":
      return {
        ...state,
        data: { name: "", description: undefined, icon: ICONS.bookmark },
        onSubmit: (__data) => { },
        open: "create"
      }
    case "UPDATE":
      return {
        ...state,
        data: { ...action.data },
        onSubmit: action.onSubmit,
        open: "update"
      }
    case "CLOSE":
      return {
        ...state,
        data: { name: "", description: undefined, icon: ICONS.bookmark },
        onSubmit: (__data) => { },
        open: null
      }
    case "OPEN_CHANGED":
      return {
        ...state,
        onSubmit: (__data) => { },
        open: action.open
      }
  }
}

function init({ name = "", description, icon }: InitialState): State {
  return {
    data: { name, description, icon },
    onSubmit: (__data) => { },
    open: null,
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

  const onOpenChildChange = (open: Open) =>
    dispatch({ type: "OPEN_CHANGED", open })
  const onChildClick: OnChildClick = (payload) =>
    dispatch({ type: "UPDATE", ...payload })
  const onAddChildClick: OnAddChildClick = () =>
    dispatch({ type: "ADD" })

  const onCreateChild = (__data: Child) => {
    /* TODO: create action on the api that creates a child for a given parent */
  }

  return (
    <>
      <Drawer modal open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="overflow-clip">
          <DrawerHeader>
            <DrawerTitle>
              Update {kindToHuman(category.kind)} Category
            </DrawerTitle>
          </DrawerHeader>
          <UpdateForm
            category={category}
            onSubmitAction={onSubmitAction}
            onDeleteAction={onDeleteAction}
            onArchiveAction={onArchiveAction}
            onUnarchiveAction={onUnarchiveAction}
            submitting={submitting || state.submitting}
            onAddChildClick={onAddChildClick}
            onChildClick={onChildClick}
          />
        </DrawerContent>
      </Drawer>

      <UpdateChild
        child={state.data}
        open={state.open === "update"}
        onSubmit={state.onSubmit}
        onOpenChange={(open) => onOpenChildChange(open ? "update" : null)}
        defaultIcon={defaultIcons[category.kind]}
        submitting={state.submitting}
      />

      <CreateChild
        action="add"
        child={state.data}
        open={state.open === "create"}
        onSubmit={onCreateChild}
        onOpenChange={(open) => onOpenChildChange(open ? "create" : null)}
        defaultIcon={defaultIcons[category.kind]}
        onDelete={() => { }}
      />
    </>
  )
}

type FormProps = {
  category: Category
  onSubmitAction: OnSubmitUpdateAction
  onDeleteAction: DeleteAction
  onArchiveAction: ArchiveAction
  onUnarchiveAction: UnarchiveAction
  onChildClick: OnChildClick
  onAddChildClick: OnAddChildClick
  submitting: boolean
}

function UpdateForm({
  category,
  onSubmitAction,
  onChildClick: onExistingChildClick,
  onAddChildClick,
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
    }
  })

  const onSubmit = async (values: z.infer<typeof schema>) =>
    await onSubmitAction({ ...values })

  return (
    <>
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
              onClick={() => onAddChildClick()}
            >
              <PlusIcon /> Add Child
            </Button>
            <div className="space-y-2">
              {category.children.map(({ id, name, description, icon }) => (
                <PreviewCard
                  key={`child.${id}`}
                  name={name}
                  description={description}
                  icon={icon}
                  onClick={() => onExistingChildClick({
                    data: { name, description: description ?? undefined, icon },
                    onSubmit: (__data) => { }
                  })
                  }
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