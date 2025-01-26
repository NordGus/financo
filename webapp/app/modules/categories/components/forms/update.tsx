import { zodResolver } from "@hookform/resolvers/zod";
import { PackageIcon, PackageOpenIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useEffect, useReducer } from "react";
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
import { childName } from "~/shared/helpers/child-name";
import { Icon } from "~/shared/types/icon";
import { schema } from "../../schemas/update";
import { ArchiveChildAction } from "../../types/archive";
import { Category } from "../../types/category";
import { CreateChildAction } from "../../types/create";
import { DeleteChildAction } from "../../types/delete";
import { defaultIcons } from "../../types/icons";
import { UnarchiveChildAction } from "../../types/unarchive";
import { OnSubmitUpdateAction, UpdateChild, UpdateChildAction } from "../../types/update";
import { PreviewCard } from "../child/preview-card";
import { ArchiveDialog as ArchiveChildDialog } from "../dialogs/child/archive";
import { DeleteDialog as DeleteChildDialog } from "../dialogs/child/delete";
import { UnarchiveDialog as UnarchiveChildDialog } from "../dialogs/child/unarchive";
import { ChildForm as CreateChildForm } from "./child/create";
import { ChildForm as UpdateChildForm } from "./child/update";

type Props = {
  category: Category
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: OnSubmitUpdateAction
  onDelete: () => void
  onArchive: () => void
  onUnarchive: () => void

  onCreateChildAction: CreateChildAction
  onUpdateChildAction: UpdateChildAction
  onDeleteChildAction: DeleteChildAction
  onArchiveChildAction: ArchiveChildAction
  onUnarchiveChildAction: UnarchiveChildAction

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
  transactions: number
}

type Open = "update" | "create" | null
type Dialog = "delete" | "archive" | "unarchive" | null

type State = {
  child: Child
  open: Open
  dialog: Dialog
  submitting: boolean
}

type InitialState = {
  category: Category
  icon: Icon
}

type OnChildClick = (child: Child) => void
type OnAddChildClick = () => void

const __actions = {
  ADD: "ADD",
  UPDATE: "UPDATE",
  OPEN_CHANGED: "OPEN_CHANGED",
  OPEN_DELETE_CHANGED: "OPEN_DELETE_CHANGED",
  OPEN_ARCHIVE_CHANGED: "OPEN_ARCHIVE_CHANGED",
  OPEN_UNARCHIVE_CHANGED: "OPEN_UNARCHIVE_CHANGED",
  ACTION_SUBMITTED: "ACTION_SUBMITTED",
  ACTION_FAILED: "ACTION_FAILED",
  CHILD_CREATED: "CHILD_CREATED",
  ACTION_SUCCEED: "ACTION_SUCCEED",
} as const

type Actions = typeof __actions

type Action =
  { type: Actions["ADD"] } |
  { type: Actions["UPDATE"], child: Child } |
  { type: Actions["OPEN_CHANGED"], open: Open } |
  { type: Actions["OPEN_DELETE_CHANGED"], open: boolean } |
  { type: Actions["OPEN_ARCHIVE_CHANGED"], open: boolean } |
  { type: Actions["OPEN_UNARCHIVE_CHANGED"], open: boolean } |
  { type: Actions["ACTION_SUBMITTED"] } |
  { type: Actions["ACTION_FAILED"] } |
  { type: Actions["ACTION_SUCCEED"] }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD":
      return {
        ...state,
        open: "create"
      }
    case "UPDATE":
      return {
        ...state,
        child: { ...action.child },
        open: "update"
      }
    case "OPEN_CHANGED":
      return {
        ...state,
        open: action.open,
        dialog: null,
      }
    case "OPEN_DELETE_CHANGED":
      return {
        ...state,
        dialog: state.open === "update" && action.open
          ? "delete"
          : null,
      }
    case "OPEN_ARCHIVE_CHANGED":
      return {
        ...state,
        dialog: state.open === "update" && action.open
          ? "archive"
          : null,
      }
    case "OPEN_UNARCHIVE_CHANGED":
      return {
        ...state,
        dialog: state.open === "update" && action.open
          ? "unarchive"
          : null,
      }
    case "ACTION_SUBMITTED":
      return { ...state, submitting: true }
    case "ACTION_FAILED":
      return { ...state, submitting: false }
    case "ACTION_SUCCEED":
      return {
        ...state,
        open: null,
        dialog: null,
        submitting: false
      }
  }
}

function init({ category, icon }: InitialState): State {
  return {
    child: {
      id: -1,
      parentId: category.id,
      name: "",
      description: "",
      icon,
      transactions: 0
    },
    open: null,
    dialog: null,
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
  onUpdateChildAction,
  onDeleteChildAction,
  onArchiveChildAction,
  onUnarchiveChildAction,
  submitting
}: Props) {
  const [state, dispatch] = useReducer(reducer, { category, icon: defaultIcons[category.kind] }, init)

  const onOpenCreateChange = (open: boolean) =>
    dispatch({ type: "OPEN_CHANGED", open: open ? "create" : null })
  const onOpenUpdateChange = (open: boolean) =>
    dispatch({ type: "OPEN_CHANGED", open: open ? "update" : null })
  const onChildClick: OnChildClick = (child) =>
    dispatch({ type: "UPDATE", child })
  const onAddChildClick: OnAddChildClick = () =>
    dispatch({ type: "ADD" })
  const onOpenDeleteChange = (open: boolean) =>
    dispatch({ type: "OPEN_DELETE_CHANGED", open })
  const onOpenArchiveChange = (open: boolean) =>
    dispatch({ type: "OPEN_ARCHIVE_CHANGED", open })
  const onOpenUnarchiveChange = (open: boolean) =>
    dispatch({ type: "OPEN_UNARCHIVE_CHANGED", open })

  const onChildActionSubmit = () =>
    dispatch({ type: "ACTION_SUBMITTED" })
  const onChildActionSuccess = () =>
    dispatch({ type: "ACTION_SUCCEED" })
  const onChildActionFailure = () =>
    dispatch({ type: "ACTION_FAILED" })

  const onCreateChild = (data: NewChild) => {
    onChildActionSubmit()

    onCreateChildAction(category.id, data, onChildActionSuccess, onChildActionFailure)
  }

  const onUpdateChild = (data: UpdateChild) => {
    onChildActionSubmit()

    return onUpdateChildAction(data, onChildActionSuccess, onChildActionFailure)
  }

  const onDeleteChild = () => {
    onChildActionSubmit()

    return onDeleteChildAction(
      state.child.parentId,
      state.child.id,
      onChildActionSuccess,
      onChildActionFailure
    )
  }

  const onArchiveChild = () => {
    onChildActionSubmit()

    return onArchiveChildAction(
      state.child.parentId,
      state.child.id,
      onChildActionSuccess,
      onChildActionFailure
    )
  }

  const onUnarchiveChild = () => {
    onChildActionSubmit()

    return onUnarchiveChildAction(
      state.child.parentId,
      state.child.id,
      onChildActionSuccess,
      onChildActionFailure
    )
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
            onSubmit={onSubmit}
            onDelete={onDelete}
            onArchive={onArchive}
            onUnarchive={onUnarchive}
            submitting={submitting || state.submitting}
            onAddChildClick={onAddChildClick}
            onChildClick={onChildClick}
          />
        </DrawerContent>
      </Drawer>

      <UpdateChildForm
        child={state.child}
        open={state.open === "update"}
        onSubmit={onUpdateChild}
        onOpenChange={onOpenCreateChange}
        onDelete={() => onOpenDeleteChange(true)}
        onArchive={() => onOpenArchiveChange(true)}
        onUnarchive={() => onOpenUnarchiveChange(true)}
        submitting={state.submitting}
      />

      <CreateChildForm
        action="add"
        child={state.child}
        open={state.open === "create"}
        onSubmit={onCreateChild}
        onOpenChange={onOpenUpdateChange}
        defaultIcon={defaultIcons[category.kind]}
        onDelete={() => { }} // onDelete is not used because it only opens as add
      />

      {
        state.child.id > 0 && (
          <>
            <DeleteChildDialog
              open={state.dialog === "delete"}
              onOpenChange={onOpenDeleteChange}
              name={childName(category, state.child)}
              transactions={state.child.transactions}
              onConfirm={onDeleteChild}
              submitting={state.submitting}
            />

            <ArchiveChildDialog
              open={state.dialog === "archive"}
              onOpenChange={onOpenArchiveChange}
              name={childName(category, state.child)}
              transactions={state.child.transactions}
              onConfirm={onArchiveChild}
              submitting={state.submitting}
            />

            <UnarchiveChildDialog
              open={state.dialog === "unarchive"}
              onOpenChange={onOpenArchiveChange}
              name={childName(category, state.child)}
              onConfirm={onUnarchiveChild}
              submitting={state.submitting}
            />
          </>
        )
      }
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
            {category.children.map(({ id, name, description, icon, archivedAt, transactions }) => (
              <PreviewCard
                key={`child.${id}`}
                name={name}
                description={description}
                icon={icon}
                archived={!!archivedAt}
                onClick={() => onChildClick({
                  id,
                  parentId: category.id,
                  name,
                  description: description ?? undefined,
                  icon,
                  archivedAt,
                  transactions
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
              <Button variant={"outline"} disabled={submitting}>
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </Form>
    </>
  )
}