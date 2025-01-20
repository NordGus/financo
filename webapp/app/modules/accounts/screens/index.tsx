import { PlusIcon } from "lucide-react";
import { Fragment, useEffect, useMemo, useReducer } from "react";
import { InfoDialog } from "~/shared/components/dialogs/info";
import { Button } from "~/shared/components/ui/button";
import { Heading1, Heading2 } from "~/shared/components/ui/headings";
import { ArchiveAccount } from "../components/dialogs/archive";
import { DeleteAccount } from "../components/dialogs/delete";
import { SelectAccountKindToCreate } from "../components/dialogs/select-account-kind-to-create";
import { SelectIndexScreenView } from "../components/dialogs/select-index-screen-view";
import { UnarchiveAccount } from "../components/dialogs/unarchive";
import { CreateAccount } from "../components/forms/create";
import { UpdateAccount } from "../components/forms/update";
import { ListForKind } from "../components/list-for-kind";
import { accountKindsManual } from "../manual/account-kinds-manual";
import { archivedAccountsManual } from "../manual/archived-accounts-manual";
import { ModuleKind } from "../types/account";
import {
  ArchiveAccountAction,
  CreateAccountAction,
  DeleteAccountAction,
  UnarchiveAccountAction,
  UpdateAccountAction
} from "../types/actions";
import { Create } from "../types/create";
import { Account } from "../types/preview";
import { Update } from "../types/update";

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

type View = "active" | "archived"

function withView(view?: string | string[] | null): View {
  switch (view) {
    case "archived":
      return "archived"
    case "active":
    default:
      return "active"
  }
}

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
  openSelectKindForCreate: boolean
  openCreate: boolean
  createKind: ModuleKind
  account: Account | null
  openEdit: boolean
  openArchive: boolean
  openUnarchive: boolean
  openDelete: boolean
  submitting: boolean
}

function reducer(state: ScreenState, action: ScreenAction): ScreenState {
  switch (action.type) {
    case "VIEW_CHANGED":
      return { ...state, view: action.view }
    case "ACCOUNT_CHANGED":
      return {
        ...state,
        account: { ...action.account },
        openEdit: true
      }
    case "CREATE_KIND_CHANGED":
      return {
        ...state,
        createKind: action.kind,
        openCreate: true,
        openSelectKindForCreate: false,
        openEdit: false,
        openArchive: false,
        openUnarchive: false,
        openDelete: false,
      }
    case "OPEN_SELECT_KIND_CHANGED":
      return {
        ...state,
        openSelectKindForCreate: action.open,
        openCreate: false,
        openEdit: false,
        openArchive: false,
        openUnarchive: false,
        openDelete: false,
      }
    case "OPEN_ARCHIVE_CHANGED":
      return {
        ...state,
        openArchive: action.open,
        openUnarchive: false,
        openDelete: false,
      }
    case "OPEN_UNARCHIVE_CHANGED":
      return {
        ...state,
        openArchive: false,
        openUnarchive: action.open,
        openDelete: false,
      }
    case "OPEN_DELETE_CHANGED":
      return {
        ...state,
        openArchive: false,
        openUnarchive: false,
        openDelete: action.open,
      }
    case "OPEN_CREATE_CHANGED":
      return {
        ...state,
        openCreate: action.open,
        openSelectKindForCreate: false,
        openEdit: false,
        openArchive: false,
        openUnarchive: false,
        openDelete: false,
      }
    case "OPEN_EDIT_CHANGED":
      return {
        ...state,
        openEdit: action.open,
        openCreate: false,
        openSelectKindForCreate: false,
        openArchive: false,
        openUnarchive: false,
        openDelete: false,
      }
    case "ACTION_SUBMITTED":
      return { ...state, submitting: true }
    case "ACTION_SUCCEED":
      return {
        ...state,
        submitting: false,
        openCreate: false,
        openEdit: false,
        openSelectKindForCreate: false,
        openArchive: false,
        openUnarchive: false,
        openDelete: false,
      }
    case "ACTION_FAILED":
      return { ...state, submitting: false }
    default:
      return { ...state }
  }
}

function init({ view }: { view: View }): ScreenState {
  return {
    view,
    openSelectKindForCreate: false,
    openCreate: false,
    createKind: "capital_normal",
    account: null,
    openEdit: false,
    openArchive: false,
    openUnarchive: false,
    openDelete: false,
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

  const inArchivedView = useMemo(() => screen.view === "archived", [screen.view])

  const onOpenSelectKindForCreateChange = (open: boolean) =>
    dispatch({ type: "OPEN_SELECT_KIND_CHANGED", open })
  const onSubmitAction = () =>
    dispatch({ type: "ACTION_SUBMITTED" })
  const onActionSuccess = () =>
    dispatch({ type: "ACTION_SUCCEED" })
  const onActionFailure = () =>
    dispatch({ type: "ACTION_FAILED" })
  const onScreenViewChange = (view: View) =>
    dispatch({ type: "VIEW_CHANGED", view })
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

  useEffect(() => onSearchParamsChange({ view: screen.view }), [screen.view])

  return (
    <Fragment>
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
            <Heading1>Accounts</Heading1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <SelectIndexScreenView
                value={screen.view}
                onValueChange={(value) => onScreenViewChange(withView(value))}
              />
            </div>
            {inArchivedView && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <InfoDialog
                  copy={archivedAccountsManual}
                  withTitleInButton
                  variant={"outline"}
                  size={"default"}
                  className="flex items-center justify-start"
                />
              </div>
            )}
            <Heading2 className="flex gap-4 items-center">
              Capital <InfoDialog copy={accountKindsManual.capital_normal} />
            </Heading2>
            <ListForKind
              accounts={accounts}
              kind="capital_normal"
              forArchived={inArchivedView}
              onSelectAccount={onAccountChange}
            />
            <Heading2 className="flex gap-4 items-center">
              Savings <InfoDialog copy={accountKindsManual.capital_savings} />
            </Heading2>
            <ListForKind
              accounts={accounts}
              kind="capital_savings"
              forArchived={inArchivedView}
              onSelectAccount={onAccountChange}
            />
            <Heading2 className="flex gap-4 items-center">
              Loans <InfoDialog copy={accountKindsManual.debt_loan} />
            </Heading2>
            <ListForKind
              accounts={accounts}
              kind="debt_loan"
              forArchived={inArchivedView}
              onSelectAccount={onAccountChange}
            />
            <Heading2 className="flex gap-4 items-center">
              Personal debts <InfoDialog copy={accountKindsManual.debt_personal} />
            </Heading2>
            <ListForKind
              accounts={accounts}
              kind="debt_personal"
              forArchived={inArchivedView}
              onSelectAccount={onAccountChange}
            />
            <Heading2 className="flex gap-4 items-center">
              Credit <InfoDialog copy={accountKindsManual.debt_credit} />
            </Heading2>
            <ListForKind
              accounts={accounts}
              kind="debt_credit"
              forArchived={inArchivedView}
              onSelectAccount={onAccountChange}
            />
            <span className="content-[''] h-9" />
          </div>
        </div>
      </div>

      <SelectAccountKindToCreate
        open={screen.openSelectKindForCreate}
        onOpenChange={onOpenSelectKindForCreateChange}
        onSelect={onCreateKindChange}
      />

      <CreateAccount
        open={screen.openCreate}
        onOpenChange={onOpenCreateChange}
        kind={screen.createKind}
        defaultCurrency="EUR"
        submitting={screen.submitting}
        onSubmitAction={onCreate}
      />

      {
        screen.account && (
          <UpdateAccount
            open={screen.openEdit}
            onOpenChange={onOpenEditChange}
            account={screen.account}
            onSubmitAction={onUpdate}
            submitting={screen.submitting}
            onOpenArchiveChange={onOpenArchiveChange}
            onOpenUnarchiveChange={onOpenUnarchiveChange}
            onOpenDeleteChange={onOpenDeleteChange}
          />
        )
      }

      {
        screen.account && (
          <ArchiveAccount
            open={screen.openArchive}
            onOpenChange={onOpenArchiveChange}
            account={screen.account}
            onConfirm={onArchive}
            submitting={screen.submitting}
          />
        )
      }

      {
        screen.account && (
          <UnarchiveAccount
            open={screen.openUnarchive}
            onOpenChange={onOpenUnarchiveChange}
            account={screen.account}
            onConfirm={onUnarchive}
            submitting={screen.submitting}
          />
        )
      }

      {
        screen.account && (
          <DeleteAccount
            open={screen.openDelete}
            onOpenChange={onOpenDeleteChange}
            account={screen.account}
            onConfirm={onDelete}
            submitting={screen.submitting}
          />
        )
      }
    </Fragment>
  )
}