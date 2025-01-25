import { zodResolver } from "@hookform/resolvers/zod";
import { PackageIcon, PackageOpenIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useEffect, useReducer } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { OnSubmitDeleteAccountAction } from "~/modules/accounts/types/actions";
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
import { Icon } from "~/shared/types/icon";
import { OnSubmitArchiveAction } from "../../types/archive";
import { Category, Child as ChildCategory } from "../../types/category";
import { CreateChildAction } from "../../types/create";
import { defaultIcons } from "../../types/icons";
import { OnSubmitUnarchiveAction } from "../../types/unarchive";
import { OnSubmitUpdateAction } from "../../types/update";
import { PreviewCard } from "../child/preview-card";
import { schema } from "../schemas/update";
import { ChildForm as CreateChildForm } from "./child/create";
import { ChildForm as UpdateChildForm } from "./child/update";

type Props = {
  category: Category
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: OnSubmitUpdateAction
  onDelete: OnSubmitDeleteAccountAction
  onArchive: OnSubmitArchiveAction
  onUnarchive: OnSubmitUnarchiveAction
  onCreateChildAction: CreateChildAction
  submitting: boolean
}

type NewChild = {
  name: string
  description?: string
  icon: Icon
}

type Child = {
  id: number
  parentId: number
  name: string
  description?: string
  icon: Icon
  archivedAt?: string | null
}

type Open = "update" | "create" | "delete" | "archive" | "unarchive" | null

type State = {
  category: Category
  child: Child
  onSubmit: (data: Child) => void
  onDelete?: () => void
  onArchive?: () => void
  onUnarchive?: () => void
  open: Open
  submitting: boolean
}

type InitialState = {
  category: Category
  icon: Icon
}

type OnChildClickPayload = {
  child: Child,
  onSubmit: (data: Child) => void,
  onDelete?: () => void,
  onArchive?: () => void,
  onUnarchive?: () => void,
}

type OnChildClick = (payload: OnChildClickPayload) => void
type OnAddChildClick = () => void

const __actions = {
  ADD: "ADD",
  UPDATE: "UPDATE",
  CLOSE: "CLOSE",
  OPEN_CHANGED: "OPEN_CHANGED",
  CATEGORY_CHANGED: "CATEGORY_CHANGED",
  ACTION_SUBMITTED: "ACTION_SUBMITTED",
  ACTION_FAILED: "ACTION_FAILED",
  CHILD_CREATED: "CHILD_CREATED",
} as const

type Actions = typeof __actions

type Action =
  { type: Actions["ADD"] } |
  { type: Actions["UPDATE"], payload: OnChildClickPayload } |
  { type: Actions["CLOSE"] } |
  { type: Actions["OPEN_CHANGED"], open: Open } |
  { type: Actions["CATEGORY_CHANGED"], category: Category } |
  { type: Actions["ACTION_SUBMITTED"] } |
  { type: Actions["ACTION_FAILED"] } |
  { type: Actions["CHILD_CREATED"], child: ChildCategory }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "CATEGORY_CHANGED":
      return {
        ...state,
        category: {
          ...action.category,
          children: [...action.category.children]
        },
        onSubmit: (__data) => { },
        onDelete: () => { },
        onArchive: () => { },
        onUnarchive: () => { },
        open: null,
        submitting: false
      }
    case "ADD":
      return {
        ...state,
        open: "create"
      }
    case "UPDATE":
      return {
        ...state,
        child: { ...action.payload.child },
        onSubmit: action.payload.onSubmit,
        onDelete: action.payload.onDelete,
        onArchive: action.payload.onArchive,
        onUnarchive: action.payload.onUnarchive,
        open: "update"
      }
    case "CLOSE":
      return {
        ...state,
        onSubmit: (__data) => { },
        onDelete: undefined,
        onArchive: undefined,
        onUnarchive: undefined,
        open: null,
        submitting: false
      }
    case "OPEN_CHANGED":
      return {
        ...state,
        open: action.open
      }
    case "ACTION_SUBMITTED":
      return { ...state, submitting: true }
    case "ACTION_FAILED":
      return { ...state, submitting: false }
    case "CHILD_CREATED":
      return {
        ...state,
        category: {
          ...state.category,
          children: [...state.category.children, action.child]
        },
        onSubmit: (__data) => { },
        onDelete: undefined,
        onArchive: undefined,
        onUnarchive: undefined,
        open: null,
        submitting: false
      }
  }
}

function init({ category, icon }: InitialState): State {
  return {
    category: {
      ...category,
      children: [
        ...category.children
      ]
    },
    child: { id: -1, parentId: category.id, name: "", description: "", icon },
    onSubmit: (__data) => { },
    onDelete: () => { },
    onArchive: () => { },
    onUnarchive: () => { },
    open: null,
    submitting: false,
  }
}

export function UpdateCategory({
  category,
  open,
  onOpenChange,
  onSubmit,
  onDelete,
  onArchive,
  onUnarchive,
  onCreateChildAction,
  submitting
}: Props) {
  const [state, dispatch] = useReducer(reducer, { category, icon: defaultIcons[category.kind] }, init)

  const onOpenChildChange = (open: Open) =>
    dispatch({ type: "OPEN_CHANGED", open })
  const onChildClick: OnChildClick = (payload) =>
    dispatch({ type: "UPDATE", payload })
  const onAddChildClick: OnAddChildClick = () =>
    dispatch({ type: "ADD" })

  const onChildCreated = (child: ChildCategory) =>
    dispatch({ type: "CHILD_CREATED", child })
  const onChildActionFailure = () =>
    dispatch({ type: "ACTION_FAILED" })

  const onCreateChild = (data: NewChild) => {
    dispatch({ type: "ACTION_SUBMITTED" })
    onCreateChildAction(state.category.id, data, onChildCreated, onChildActionFailure)
  }

  const destroy = () => onDelete(state.category.id)
  const archive = () => onArchive(state.category.id)
  const unarchive = () => onUnarchive(state.category.id)

  useEffect(() => dispatch({ type: "CATEGORY_CHANGED", category }), [category.id])

  return (
    <>
      <Drawer modal open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="overflow-clip">
          <DrawerHeader>
            <DrawerTitle>
              Update {kindToHuman(state.category.kind)} Category
            </DrawerTitle>
          </DrawerHeader>
          <UpdateForm
            category={state.category}
            onSubmit={onSubmit}
            onDelete={destroy}
            onArchive={archive}
            onUnarchive={unarchive}
            submitting={submitting || state.submitting}
            onAddChildClick={onAddChildClick}
            onChildClick={onChildClick}
          />
        </DrawerContent>
      </Drawer>

      <UpdateChildForm
        child={state.child}
        open={state.open === "update"}
        onSubmit={state.onSubmit}
        onOpenChange={(open) => onOpenChildChange(open ? "update" : null)}
        submitting={state.submitting}
      />

      <CreateChildForm
        action="add"
        child={state.child}
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
  onSubmit: OnSubmitUpdateAction
  onDelete: () => void
  onArchive: () => void
  onUnarchive: () => void
  onChildClick: OnChildClick
  onAddChildClick: OnAddChildClick
  submitting: boolean
}

function UpdateForm({
  category,
  onSubmit: onSubmitAction,
  onDelete,
  onArchive,
  onUnarchive,
  onChildClick,
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

  useEffect(() => {
    if (Object.keys(form.formState.errors).length === 0) return

    console.error(form.formState.errors)
  }, [form.formState.errors])

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
              onClick={onAddChildClick}
            >
              <PlusIcon /> Add Child
            </Button>
            {category.children.map(({ id, name, description, icon, archivedAt }) => (
              <PreviewCard
                key={`child.${id}`}
                name={name}
                description={description}
                icon={icon}
                onClick={() => onChildClick({
                  child: {
                    id,
                    parentId: category.id,
                    name,
                    description: description ?? undefined,
                    icon,
                    archivedAt
                  },
                  onSubmit: (__data) => { },
                  onDelete: undefined,
                  onArchive: undefined,
                  onUnarchive: undefined,
                })
                }
              />
            ))}
          </div>
          <DrawerFooter>
            <Button type="submit" className="min-w-24" disabled={submitting}>
              {submitting ? <Throbber size={"sm"} /> : "Update"}
            </Button>
            {
              !category.archivedAt && (
                <Button
                  variant={"secondary"}
                  onClick={onArchive}
                  disabled={submitting}
                  type="button"
                >
                  <PackageIcon /> Archive
                </Button>
              )
            }
            {
              !!category.archivedAt && (
                <Button
                  variant={"secondary"}
                  onClick={onUnarchive}
                  disabled={submitting}
                  type="button"
                >
                  <PackageOpenIcon /> Unarchive
                </Button>
              )
            }

            <Button
              variant={"destructive"}
              onClick={onDelete}
              disabled={submitting}
              type="button"
            >
              <TrashIcon /> Delete
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