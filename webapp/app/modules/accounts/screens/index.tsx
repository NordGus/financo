import { ArrowDownUpIcon, BanknoteIcon, BookTextIcon, PlusIcon } from "lucide-react";
import { useReducer } from "react";
import { Button } from "~/modules/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/modules/shared/components/ui/tabs";
import { ArchiveAccount } from "../components/dialogs/archive";
import { DeleteAccount } from "../components/dialogs/delete";
import { SelectAccountKindToCreate } from "../components/dialogs/select-account-kind-to-create";
import { UnarchiveAccount } from "../components/dialogs/unarchive";
import { CreateAccount } from "../components/forms/create";
import { UpdateAccount } from "../components/forms/update";
import { Account, ModuleKind } from "../types/account";
import { ArchiveAccountAction } from "../types/archive";
import { Create, CreateAccountAction } from "../types/create";
import { DeleteAccountAction } from "../types/delete";
import { UnarchiveAccountAction } from "../types/unarchive";
import { Update, UpdateAccountAction } from "../types/update";
import { Screen as ActivesScreen } from "./root/actives";
import { Screen as FinancesScreen } from "./root/finances";
import { Screen as PassivesScreen } from "./root/passives";

interface Props {
  accounts: Account[]
  onSearchParamsChange: (nextInit: Record<string, string | string[]>) => void
  searchParams: URLSearchParams
  onCreateAccountAction: CreateAccountAction
  onUpdateAccountAction: UpdateAccountAction
  onArchiveAccountAction: ArchiveAccountAction
  onUnarchiveAccountAction: UnarchiveAccountAction
  onDeleteAccountAction: DeleteAccountAction
}

type View = "actives" | "passives" | "finances"

function withView(view?: string | string[] | null): View {
  switch (view) {
    case "passives":
      return "passives"
    case "finances":
      return "finances"
    case "actives":
    default:
      return "actives"
  }
}

type Open = "kind" | "create" | "update" | null
type Dialog = "delete" | "archive" | "unarchive" | null

const _screenActions = {
  VIEW_CHANGED: "VIEW_CHANGED",
  ACCOUNT_CHANGED: "ACCOUNT_CHANGED",
  CREATE_KIND_CHANGED: "CREATE_KIND_CHANGED",
  OPEN_SELECT_KIND_CHANGED: "OPEN_SELECT_KIND_CHANGED",
  OPEN_ARCHIVE_CHANGED: "OPEN_ARCHIVE_CHANGED",
  OPEN_UNARCHIVE_CHANGED: "OPEN_UNARCHIVE_CHANGED",
  OPEN_DELETE_CHANGED: "OPEN_DELETE_CHANGED",
  OPEN_CREATE_CHANGED: "OPEN_CREATE_CHANGED",
  OPEN_EDIT_CHANGED: "OPEN_EDIT_CHANGED",
  ACTION_SUBMITTED: "ACTION_SUBMITTED",
  ACTION_SUCCEED: "ACTION_SUCCEED",
  ACTION_FAILED: "ACTION_FAILED",
} as const

type ScreenActions = typeof _screenActions

type ScreenAction =
  { type: ScreenActions["VIEW_CHANGED"], view: View } |
  { type: ScreenActions["ACCOUNT_CHANGED"], account: Account } |
  { type: ScreenActions["CREATE_KIND_CHANGED"], kind: ModuleKind } |
  { type: ScreenActions["OPEN_SELECT_KIND_CHANGED"], open: boolean } |
  { type: ScreenActions["OPEN_ARCHIVE_CHANGED"], open: boolean } |
  { type: ScreenActions["OPEN_UNARCHIVE_CHANGED"], open: boolean } |
  { type: ScreenActions["OPEN_DELETE_CHANGED"], open: boolean } |
  { type: ScreenActions["OPEN_CREATE_CHANGED"], open: boolean } |
  { type: ScreenActions["OPEN_EDIT_CHANGED"], open: boolean } |
  { type: ScreenActions["ACTION_SUBMITTED"] } |
  { type: ScreenActions["ACTION_SUCCEED"] } |
  { type: ScreenActions["ACTION_FAILED"] }

type ScreenState = {
  view: View
  createKind: ModuleKind
  id: number
  open: Open
  dialog: Dialog
  submitting: boolean
}

function reducer(state: ScreenState, action: ScreenAction): ScreenState {
  switch (action.type) {
    case "VIEW_CHANGED":
      return { ...state, view: action.view }
    case "ACCOUNT_CHANGED":
      return {
        ...state,
        id: action.account.id,
        open: "update",
        dialog: null,
      }
    case "CREATE_KIND_CHANGED":
      return {
        ...state,
        createKind: action.kind,
        open: "create",
        dialog: null,
      }
    case "OPEN_SELECT_KIND_CHANGED":
      return {
        ...state,
        open: action.open ? "kind" : null,
        dialog: null
      }
    case "OPEN_ARCHIVE_CHANGED":
      return {
        ...state,
        dialog: state.open === "update" && action.open
          ? "archive"
          : null
      }
    case "OPEN_UNARCHIVE_CHANGED":
      return {
        ...state,
        dialog: state.open === "update" && action.open
          ? "unarchive"
          : null
      }
    case "OPEN_DELETE_CHANGED":
      return {
        ...state,
        dialog: state.open === "update" && action.open
          ? "delete"
          : null
      }
    case "OPEN_CREATE_CHANGED":
      return {
        ...state,
        open: action.open ? "create" : null,
        dialog: null
      }
    case "OPEN_EDIT_CHANGED":
      return {
        ...state,
        open: action.open ? "update" : null,
        dialog: null
      }
    case "ACTION_SUBMITTED":
      return { ...state, submitting: true }
    case "ACTION_SUCCEED":
      return {
        ...state,
        submitting: false,
        open: null,
        dialog: null
      }
    case "ACTION_FAILED":
      return { ...state, submitting: false }
  }
}

function init({ view }: { view: View }): ScreenState {
  return {
    view,
    createKind: "capital",
    id: -1,
    open: null,
    dialog: null,
    submitting: false,
  }
}

export function Screen({
  accounts,
  searchParams,
  onSearchParamsChange,
  onCreateAccountAction,
  onUpdateAccountAction,
  onArchiveAccountAction,
  onUnarchiveAccountAction,
  onDeleteAccountAction,
}: Props) {
  const [screen, dispatch] = useReducer(reducer, { view: withView(searchParams.get("view")) }, init)

  const onOpenSelectKindForCreateChange = (open: boolean) =>
    dispatch({ type: "OPEN_SELECT_KIND_CHANGED", open })
  const onSubmitAction = () =>
    dispatch({ type: "ACTION_SUBMITTED" })
  const onActionSuccess = () =>
    dispatch({ type: "ACTION_SUCCEED" })
  const onActionFailure = () =>
    dispatch({ type: "ACTION_FAILED" })
  const onOpenCreateChange = (open: boolean) =>
    dispatch({ type: "OPEN_CREATE_CHANGED", open })
  const onCreateKindChange = (kind: ModuleKind) =>
    dispatch({ type: "CREATE_KIND_CHANGED", kind })
  const onOpenEditChange = (open: boolean) =>
    dispatch({ type: "OPEN_EDIT_CHANGED", open })
  const onAccountChange = (account: Account) =>
    dispatch({ type: "ACCOUNT_CHANGED", account })
  const onOpenArchiveChange = (open: boolean) =>
    dispatch({ type: "OPEN_ARCHIVE_CHANGED", open })
  const onOpenUnarchiveChange = (open: boolean) =>
    dispatch({ type: "OPEN_UNARCHIVE_CHANGED", open })
  const onOpenDeleteChange = (open: boolean) =>
    dispatch({ type: "OPEN_DELETE_CHANGED", open })
  const onScreenViewChange = (view: View) => {
    dispatch({ type: "VIEW_CHANGED", view })
    onSearchParamsChange({ view })
  }

  const onCreate = (values: Create) => {
    onSubmitAction()

    return onCreateAccountAction(values, onActionSuccess, onActionFailure)
  }

  const onUpdate = (values: Update) => {
    onSubmitAction()

    return onUpdateAccountAction(values, onActionSuccess, onActionFailure)
  }

  const onArchive = (id: number) => {
    onSubmitAction()

    return onArchiveAccountAction(id, onActionSuccess, onActionFailure)
  }

  const onUnarchive = (id: number) => {
    onSubmitAction()

    return onUnarchiveAccountAction(id, onActionSuccess, onActionFailure)
  }

  const onDelete = (id: number) => {
    onSubmitAction()

    return onDeleteAccountAction(id, onActionSuccess, onActionFailure)
  }

  const selected = accounts.find(({ id }) => id === screen.id)

  return (
    <>
      <div className="relative overflow-hidden h-full">
        <Button
          size={"icon"}
          className="absolute bottom-0 right-0 m-4 shadow-lg"
          onClick={() => onOpenSelectKindForCreateChange(true)}
        >
          <PlusIcon />
        </Button>
        <div className="overflow-x-hidden overflow-y-auto h-full p-4">
          <div className="flex flex-col gap-4">
            <Tabs value={screen.view} onValueChange={(value) => onScreenViewChange(withView(value))}>
              <TabsList className="w-full">
                <TabsTrigger value="actives">
                  <BanknoteIcon className="size-4" /> Actives
                </TabsTrigger>
                <TabsTrigger value="passives">
                  <ArrowDownUpIcon className="size-4" /> Passives
                </TabsTrigger>
                <TabsTrigger value="finances">
                  <BookTextIcon className="size-4" /> My Finances
                </TabsTrigger>
              </TabsList>
              <TabsContent value="actives">
                <ActivesScreen onAccountClick={onAccountChange} />
              </TabsContent>
              <TabsContent value="passives">
                <PassivesScreen onAccountClick={onAccountChange} />
              </TabsContent>
              <TabsContent value="finances">
                <FinancesScreen />
              </TabsContent>
            </Tabs>
            <span className="content-[''] h-9" />
          </div>
        </div>
      </div>

      <SelectAccountKindToCreate
        open={screen.open === "kind"}
        onOpenChange={onOpenSelectKindForCreateChange}
        onSelect={onCreateKindChange}
      />

      <CreateAccount
        open={screen.open === "create"}
        onOpenChange={onOpenCreateChange}
        kind={screen.createKind}
        defaultCurrency="EUR"
        submitting={screen.submitting}
        onSubmitAction={onCreate}
      />

      {
        selected && (
          <>
            <UpdateAccount
              open={screen.open === "update"}
              onOpenChange={onOpenEditChange}
              account={selected}
              onSubmitAction={onUpdate}
              submitting={screen.submitting}
              onOpenArchiveChange={onOpenArchiveChange}
              onOpenUnarchiveChange={onOpenUnarchiveChange}
              onOpenDeleteChange={onOpenDeleteChange}
            />

            <ArchiveAccount
              open={screen.dialog === "archive"}
              onOpenChange={onOpenArchiveChange}
              account={selected}
              onConfirm={onArchive}
              submitting={screen.submitting}
            />

            <UnarchiveAccount
              open={screen.dialog === "unarchive"}
              onOpenChange={onOpenUnarchiveChange}
              account={selected}
              onConfirm={onUnarchive}
              submitting={screen.submitting}
            />

            <DeleteAccount
              open={screen.dialog === "delete"}
              onOpenChange={onOpenDeleteChange}
              account={selected}
              onConfirm={onDelete}
              submitting={screen.submitting}
            />
          </>
        )
      }
    </>
  )
}