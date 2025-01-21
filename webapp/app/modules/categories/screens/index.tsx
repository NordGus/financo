import { PlusIcon } from "lucide-react";
import { Fragment, useReducer } from "react";
import { InfoDialog } from "~/shared/components/dialogs/info";
import { Button } from "~/shared/components/ui/button";
import { Heading1 } from "~/shared/components/ui/headings";
import { isExpense, isIncome, KINDS } from "~/shared/types/account";
import { SelectIndexScreenSubView } from "../components/dialogs/select-index-screen-sub-view";
import { SelectIndexScreenView } from "../components/dialogs/select-index-screen-view";
import { SelectKindToCreate } from "../components/dialogs/select-kind-to-create";
import { CreateCategory } from "../components/forms/create";
import { ListForKind } from "../components/list-for-kind";
import { archivedCategoriesManual } from "../manual/archived-categories-manual";
import { ModuleKind } from "../types/account";
import { ArchiveAction, CreateAction, DeleteAction, UnarchiveAction, UpdateAction } from "../types/actions";
import { Create } from "../types/create";
import { Account } from "../types/preview";

interface Props {
  accounts: Account[]
  searchParams: URLSearchParams
  onSearchParamsChange: (nextInit: Record<string, string | string[]>) => void
  onCreateAction: CreateAction
  onUpdateAction: UpdateAction
  onDeleteAction: DeleteAction
  onArchiveAction: ArchiveAction
  onUnarchiveAction: UnarchiveAction
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

const _screenActions = {
  VIEW_CHANGED: "VIEW_CHANGED",
  SUBVIEW_CHANGED: "SUBVIEW_CHANGED",
  KIND_CHANGED: "KIND_CHANGED",
  OPEN_SELECT_KIND_CHANGED: "OPEN_SELECT_KIND_CHANGED",
  OPEN_CREATE_CHANGED: "OPEN_CREATE_CHANGED",
  ACTION_SUBMITTED: "ACTION_SUBMITTED",
  ACTION_SUCCEED: "ACTION_SUCCEED",
  ACTION_FAILED: "ACTION_FAILED",
} as const

type ScreenActions = typeof _screenActions

type ScreenAction =
  { type: ScreenActions["VIEW_CHANGED"], value: View } |
  { type: ScreenActions["SUBVIEW_CHANGED"], value: SubView } |
  { type: ScreenActions["KIND_CHANGED"], kind: ModuleKind } |
  { type: ScreenActions["OPEN_SELECT_KIND_CHANGED"], open: boolean } |
  { type: ScreenActions["OPEN_CREATE_CHANGED"], open: boolean } |
  { type: ScreenActions["ACTION_SUBMITTED"] } |
  { type: ScreenActions["ACTION_SUCCEED"] } |
  { type: ScreenActions["ACTION_FAILED"] }

type ScreenState = {
  view: View
  subView: SubView
  kind: ModuleKind
  openSelectKind: boolean
  openCreate: boolean
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
        openSelectKind: false,
        openCreate: true
      }
    case "OPEN_SELECT_KIND_CHANGED":
      return {
        ...state,
        openSelectKind: action.open,
        openCreate: false
      }
    case "OPEN_CREATE_CHANGED":
      return {
        ...state,
        openSelectKind: false,
        openCreate: action.open
      }
    case "ACTION_SUBMITTED":
      return { ...state, submitting: true }
    case "ACTION_SUCCEED":
      return {
        ...state,
        submitting: false,
        openSelectKind: false,
        openCreate: false
      }
    case "ACTION_FAILED":
      return { ...state, submitting: false }
    default:
      return { ...state }
  }
}

function init({ view, subView }: { view: View, subView: SubView }): ScreenState {
  return {
    view,
    subView,
    kind: "external_expense",
    openSelectKind: false,
    openCreate: false,
    submitting: false,
  }
}

export function Screen({
  accounts,
  searchParams,
  onSearchParamsChange,
  onCreateAction,
}: Props) {
  const [screen, dispatch] = useReducer(
    reducer,
    {
      view: withView(searchParams.get("view")),
      subView: withSubView(searchParams.get("sub-view"))
    },
    init
  )

  const archived = (account: Account) => {
    const filterFn = (archivedAt?: string | null) => screen.subView === "active" ? !archivedAt : !!archivedAt

    return filterFn(account.archivedAt) || account.children.filter((child) => filterFn(child.archivedAt)).length > 0
  }
  const kinded = (account: Account) => {
    const filterFn = screen.view === "income" ? isIncome : isExpense

    return filterFn(account.kind) || account.children.filter(({ kind }) => filterFn(kind)).length > 0
  }

  const onViewChange = (value: View) => {
    dispatch({ type: "VIEW_CHANGED", value })
    onSearchParamsChange({ view: value, ["sub-view"]: screen.subView })
  }
  const onSubViewChange = (value: SubView) => {
    dispatch({ type: "SUBVIEW_CHANGED", value })
    onSearchParamsChange({ view: screen.view, ["sub-view"]: value })
  }
  const onOpenSelectKindChange = (open: boolean) =>
    dispatch({ type: "OPEN_SELECT_KIND_CHANGED", open })
  const onKindChange = (kind: ModuleKind) =>
    dispatch({ type: "KIND_CHANGED", kind })
  const onOpenCreateChange = (open: boolean) =>
    dispatch({ type: "OPEN_CREATE_CHANGED", open })

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
            accounts={accounts.filter((a) => kinded(a)).filter((a) => archived(a))}
            kind={screen.view === "income" ? KINDS["external_income"] : KINDS["external_expense"]}
            archived={screen.subView === "archived"}
          />
        </div>
      </div>

      <SelectKindToCreate
        open={screen.openSelectKind}
        onOpenChange={onOpenSelectKindChange}
        onSelect={onKindChange}
      />

      <CreateCategory
        open={screen.openCreate}
        onOpenChange={onOpenCreateChange}
        kind={screen.kind}
        defaultCurrency="EUR"
        submitting={screen.submitting}
        onSubmitAction={onCreate}
      />

    </Fragment>
  )
}