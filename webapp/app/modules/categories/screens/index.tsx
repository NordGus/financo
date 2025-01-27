import { PlusIcon } from "lucide-react";
import { Fragment, useReducer } from "react";
import { InfoDialog } from "~/shared/components/dialogs/info";
import { Button } from "~/shared/components/ui/button";
import { Heading1 } from "~/shared/components/ui/headings";
import { ArchiveDialog } from "../components/dialogs/archive";
import { DeleteDialog } from "../components/dialogs/delete";
import { SelectIndexScreenSubView } from "../components/dialogs/select-index-screen-sub-view";
import { SelectIndexScreenView } from "../components/dialogs/select-index-screen-view";
import { SelectKindToCreate } from "../components/dialogs/select-kind-to-create";
import { UnarchiveDialog } from "../components/dialogs/unarchive";
import { CreateCategory } from "../components/forms/create";
import { UpdateCategory } from "../components/forms/update";
import { ListForKind } from "../components/list-for-kind";
import { archivedCategoriesManual } from "../manual/archived-categories-manual";
import { ArchiveAction, ArchiveChildAction } from "../types/archive";
import { Category, ModuleKind } from "../types/category";
import { Create, CreateAction, CreateChildAction } from "../types/create";
import { DeleteAction, DeleteChildAction } from "../types/delete";
import { UnarchiveAction, UnarchiveChildAction } from "../types/unarchive";
import { Update, UpdateAction, UpdateChildAction } from "../types/update";

interface Props {
  categories: Category[]

  searchParams: URLSearchParams
  onSearchParamsChange: (nextInit: Record<string, string | string[]>) => void

  onCreateAction: CreateAction
  onUpdateAction: UpdateAction
  onDeleteAction: DeleteAction
  onArchiveAction: ArchiveAction
  onUnarchiveAction: UnarchiveAction

  onCreateChildAction: CreateChildAction
  onUpdateChildAction: UpdateChildAction
  onDeleteChildAction: DeleteChildAction
  onArchiveChildAction: ArchiveChildAction
  onUnarchiveChildAction: UnarchiveChildAction
}

type SubView = "active" | "archived"

function withSubView(view?: string | null): SubView {
  switch (view) {
    case "archived":
      return "archived"
    case "active":
    default:
      return "active"
  }
}

type View = "expense" | "income"

function withView(view?: string | null): View {
  switch (view) {
    case "income":
      return "income"
    case "expense":
    default:
      return "expense"
  }
}

type Open = "kind" | "create" | "update" | null
type OpenDialog = "delete" | "archive" | "unarchive" | null

const _screenActions = {
  VIEW_CHANGED: "VIEW_CHANGED",
  SUBVIEW_CHANGED: "SUBVIEW_CHANGED",
  KIND_CHANGED: "KIND_CHANGED",
  CATEGORY_CHANGED: "CATEGORY_CHANGED",
  OPEN_SELECT_KIND_CHANGED: "OPEN_SELECT_KIND_CHANGED",
  OPEN_CREATE_CHANGED: "OPEN_CREATE_CHANGED",
  OPEN_EDIT_CHANGED: "OPEN_EDIT_CHANGED",
  OPEN_DELETE_CHANGED: "OPEN_DELETE_CHANGED",
  OPEN_ARCHIVE_CHANGED: "OPEN_ARCHIVE_CHANGED",
  OPEN_UNARCHIVE_CHANGED: "OPEN_UNARCHIVE_CHANGED",
  ACTION_SUBMITTED: "ACTION_SUBMITTED",
  ACTION_SUCCEED: "ACTION_SUCCEED",
  ACTION_FAILED: "ACTION_FAILED",
} as const

type ScreenActions = typeof _screenActions

type ScreenAction =
  { type: ScreenActions["VIEW_CHANGED"], value: View } |
  { type: ScreenActions["SUBVIEW_CHANGED"], value: SubView } |
  { type: ScreenActions["KIND_CHANGED"], kind: ModuleKind } |
  { type: ScreenActions["CATEGORY_CHANGED"], category: Category } |
  { type: ScreenActions["OPEN_SELECT_KIND_CHANGED"], open: boolean } |
  { type: ScreenActions["OPEN_CREATE_CHANGED"], open: boolean } |
  { type: ScreenActions["OPEN_EDIT_CHANGED"], open: boolean } |
  { type: ScreenActions["OPEN_DELETE_CHANGED"], open: boolean } |
  { type: ScreenActions["OPEN_ARCHIVE_CHANGED"], open: boolean } |
  { type: ScreenActions["OPEN_UNARCHIVE_CHANGED"], open: boolean } |
  { type: ScreenActions["ACTION_SUBMITTED"] } |
  { type: ScreenActions["ACTION_SUCCEED"] } |
  { type: ScreenActions["ACTION_FAILED"] }

type ScreenState = {
  view: View
  subView: SubView
  kind: ModuleKind
  id: number
  open: Open
  dialog: OpenDialog
  submitting: boolean
}

function reducer(state: ScreenState, action: ScreenAction): ScreenState {
  switch (action.type) {
    case "VIEW_CHANGED":
      return { ...state, view: action.value }
    case "SUBVIEW_CHANGED":
      return { ...state, subView: action.value }
    case "KIND_CHANGED":
      return {
        ...state,
        kind: action.kind,
        open: "create",
        dialog: null,
      }
    case "CATEGORY_CHANGED":
      return {
        ...state,
        id: action.category.id,
        open: "update",
        dialog: null,
      }
    case "OPEN_SELECT_KIND_CHANGED":
      return {
        ...state,
        open: action.open ? "kind" : null,
        dialog: null,
      }
    case "OPEN_CREATE_CHANGED":
      return {
        ...state,
        open: action.open ? "create" : null,
        dialog: null,
      }
    case "OPEN_EDIT_CHANGED":
      return {
        ...state,
        open: action.open ? "update" : null,
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
    case "ACTION_SUCCEED":
      return {
        ...state,
        submitting: false,
        open: null,
        dialog: null,
      }
    case "ACTION_FAILED":
      return { ...state, submitting: false }
  }
}

function init({ view, subView }: { view: View, subView: SubView }): ScreenState {
  return {
    view,
    subView,
    kind: "external_expense",
    id: -1,
    open: null,
    dialog: null,
    submitting: false,
  }
}

export function Screen({
  categories,
  searchParams,
  onSearchParamsChange,
  onCreateAction,
  onUpdateAction,
  onArchiveAction,
  onUnarchiveAction,
  onDeleteAction,
  onCreateChildAction,
  onUpdateChildAction,
  onDeleteChildAction,
  onArchiveChildAction,
  onUnarchiveChildAction,
}: Props) {
  const [screen, dispatch] = useReducer(
    reducer,
    {
      view: withView(searchParams.get("view")),
      subView: withSubView(searchParams.get("subSiew"))
    },
    init
  )

  const onViewChange = (value: View) => {
    dispatch({ type: "VIEW_CHANGED", value })
    onSearchParamsChange({ view: value, subView: screen.subView })
  }
  const onSubViewChange = (value: SubView) => {
    dispatch({ type: "SUBVIEW_CHANGED", value })
    onSearchParamsChange({ view: screen.view, subView: value })
  }

  const onOpenSelectKindChange = (open: boolean) =>
    dispatch({ type: "OPEN_SELECT_KIND_CHANGED", open })
  const onKindChange = (kind: ModuleKind) =>
    dispatch({ type: "KIND_CHANGED", kind })
  const onOpenCreateChange = (open: boolean) =>
    dispatch({ type: "OPEN_CREATE_CHANGED", open })

  const onCategoryChange = (category: Category) =>
    dispatch({ type: "CATEGORY_CHANGED", category })
  const onOpenEditChange = (open: boolean) =>
    dispatch({ type: "OPEN_EDIT_CHANGED", open })

  const onActionSubmit = () =>
    dispatch({ type: "ACTION_SUBMITTED" })
  const onActionSuccess = () =>
    dispatch({ type: "ACTION_SUCCEED" })
  const onActionFailure = () =>
    dispatch({ type: "ACTION_FAILED" })

  const onCreate = (values: Create) => {
    onActionSubmit()

    return onCreateAction(values, onActionSuccess, onActionFailure)
  }

  const onUpdate = (values: Update) => {
    onActionSubmit()

    return onUpdateAction(values, onActionSuccess, onActionFailure)
  }

  const onOpenDeleteChange = (open: boolean) =>
    dispatch({ type: "OPEN_DELETE_CHANGED", open })
  const onOpenArchiveChange = (open: boolean) =>
    dispatch({ type: "OPEN_ARCHIVE_CHANGED", open })
  const onOpenUnarchiveChange = (open: boolean) =>
    dispatch({ type: "OPEN_UNARCHIVE_CHANGED", open })

  const onDeleteConfirm = (id: number) => {
    onActionSubmit()

    return onDeleteAction(id, onActionSuccess, onActionFailure)
  }

  const onArchiveConfirm = (id: number) => {
    onActionSubmit()

    return onArchiveAction(id, onActionSuccess, onActionFailure)
  }

  const onUnarchiveConfirm = (id: number) => {
    onActionSubmit()

    return onUnarchiveAction(id, onActionSuccess, onActionFailure)
  }

  const selected = categories.find(({ id }) => id === screen.id)

  return (
    <Fragment>
      <div className="relative overflow-hidden h-full">
        <Button
          size={"icon"}
          className="absolute bottom-0 right-0 m-4 shadow-lg"
          onClick={() => onOpenSelectKindChange(true)}
        >
          <PlusIcon />
        </Button>
        <div className="overflow-x-hidden overflow-y-auto h-full p-4 flex flex-col gap-4">
          <Heading1>Categories</Heading1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <SelectIndexScreenView value={screen.view} onValueChange={onViewChange} />
            <SelectIndexScreenSubView value={screen.subView} onValueChange={onSubViewChange} />
          </div>
          {screen.subView === "archived" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <InfoDialog
                copy={archivedCategoriesManual}
                withTitleInButton
                variant={"outline"}
                size={"default"}
                className="flex items-center justify-start"
              />
            </div>
          )}
          <ListForKind
            categories={categories}
            kind={screen.view === "income" ? "external_income" : "external_expense"}
            forArchived={screen.subView === "archived"}
            onClick={onCategoryChange}
          />
        </div>
      </div>

      <SelectKindToCreate
        open={screen.open === "kind"}
        onOpenChange={onOpenSelectKindChange}
        onSelect={onKindChange}
      />

      <CreateCategory
        open={screen.open === "create"}
        onOpenChange={onOpenCreateChange}
        kind={screen.kind}
        defaultCurrency="EUR"
        submitting={screen.submitting}
        onSubmitAction={onCreate}
      />

      {
        selected && (
          <>
            <UpdateCategory
              open={screen.open === "update"}
              onOpenChange={onOpenEditChange}

              category={selected}

              submitting={screen.submitting}

              onSubmit={onUpdate}
              onDelete={() => onOpenDeleteChange(true)}
              onArchive={() => onOpenArchiveChange(true)}
              onUnarchive={() => onOpenUnarchiveChange(true)}

              onCreateChildAction={onCreateChildAction}
              onUpdateChildAction={onUpdateChildAction}
              onDeleteChildAction={onDeleteChildAction}
              onArchiveChildAction={onArchiveChildAction}
              onUnarchiveChildAction={onUnarchiveChildAction}
            />

            <DeleteDialog
              open={screen.dialog === "delete"}
              onOpenChange={onOpenDeleteChange}
              name={selected.name}
              transactions={selected.transactions}
              childrenCount={selected.children.length}
              onConfirm={() => onDeleteConfirm(screen.id)}
              submitting={screen.submitting}
            />

            <ArchiveDialog
              open={screen.dialog === "archive"}
              onOpenChange={onOpenArchiveChange}
              name={selected.name}
              transactions={selected.transactions}
              childrenCount={selected.children.length}
              onConfirm={() => onArchiveConfirm(screen.id)}
              submitting={screen.submitting}
            />

            <UnarchiveDialog
              open={screen.dialog === "unarchive"}
              onOpenChange={onOpenUnarchiveChange}
              name={selected.name}
              childrenCount={selected.children.length}
              onConfirm={() => onUnarchiveConfirm(screen.id)}
              submitting={screen.submitting}
            />
          </>
        )
      }

    </Fragment>
  )
}