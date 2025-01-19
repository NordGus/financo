import { Fragment, useEffect, useMemo, useReducer } from "react";
import { InfoDialog } from "~/shared/components/dialogs/info";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "~/shared/components/ui/drawer";
import { Heading1, Heading2 } from "~/shared/components/ui/headings";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/shared/components/ui/select";
import { isCapital, isCredit, isLoan, isPersonalDebt, isSavings } from "~/shared/types/account";
import { CreateAccount } from "../components/forms/create";
import { ListForKind } from "../components/list-for-kind";
import { accountKindsManual } from "../manual/account-kinds-manual";
import { archivedAccountsManual } from "../manual/archived-accounts-manual";
import { ModuleKind } from "../types/account";
import { CreateAccountAction } from "../types/actions";
import { Create } from "../types/create";
import { Account } from "../types/preview";

interface Props {
  accounts: Account[]
  onSearchParamsChange: (nextInit: Record<string, string | string[]>) => void
  searchParams: URLSearchParams
  onCreateAccountAction: CreateAccountAction
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
  OPEN_CREATE_CHANGED: "OPEN_CREATE_CHANGED",
  FORM_SUBMITTED: "FORM_SUBMITTED",
  ACCOUNT_CREATED: "ACCOUNT_CREATED",
  CREATE_ACCOUNT_FAILED: "CREATE_ACCOUNT_FAILED",
} as const

type ScreenActions = typeof _screenActions

type ScreenAction =
  { type: ScreenActions["VIEW_CHANGED"], view: View } |
  { type: ScreenActions["OPEN_CREATE_CHANGED"], open: boolean, kind: ModuleKind | null } |
  { type: ScreenActions["FORM_SUBMITTED"] } |
  { type: ScreenActions["ACCOUNT_CREATED"] } |
  { type: ScreenActions["CREATE_ACCOUNT_FAILED"] }

type ScreenState = {
  view: View,
  accountFilter: (value?: string | null) => boolean
  openCreate: boolean,
  createKind: ModuleKind | null,
  submitting: boolean
}

function reducer(state: ScreenState, action: ScreenAction): ScreenState {
  switch (action.type) {
    case "VIEW_CHANGED":
      return {
        ...state,
        view: action.view,
        accountFilter: action.view === "active"
          ? (v?: string | null) => !v
          : (v?: string | null) => !!v
      }
    case "OPEN_CREATE_CHANGED":
      return { ...state, openCreate: action.open, createKind: action.kind }
    case "FORM_SUBMITTED":
      return { ...state, submitting: true }
    case "ACCOUNT_CREATED":
      return { ...state, submitting: false, createKind: null, openCreate: false }
    case "CREATE_ACCOUNT_FAILED":
      return { ...state, submitting: false }
    default:
      return { ...state }
  }
}

function init({ view }: { view: View }): ScreenState {
  return {
    view,
    accountFilter: view === "active"
      ? (v?: string | null) => !v
      : (v?: string | null) => !!v,
    openCreate: false,
    createKind: null,
    submitting: false,
  }
}

export function Screen({
  accounts,
  searchParams,
  onSearchParamsChange,
  onCreateAccountAction,
}: Props) {
  const [screen, dispatch] = useReducer(reducer, { view: withView(searchParams.get("view")) }, init)

  const inArchivedView = useMemo(() => screen.view === "archived", [screen.view])

  const onSubmitForm = () =>
    dispatch({ type: "FORM_SUBMITTED" })
  const onCreateAccountSuccess = () =>
    dispatch({ type: "ACCOUNT_CREATED" })
  const onCreateAccountFailure = () =>
    dispatch({ type: "CREATE_ACCOUNT_FAILED" })
  const onScreenViewChange = (view: View) =>
    dispatch({ type: "VIEW_CHANGED", view })
  const onOpenCreateChange = (open: boolean, kind: ModuleKind | null) =>
    dispatch({ type: "OPEN_CREATE_CHANGED", open, kind })

  const onCreate = (values: Create) => {
    onSubmitForm()

    return onCreateAccountAction(
      values,
      onCreateAccountSuccess,
      onCreateAccountFailure
    )
  }

  useEffect(() => onSearchParamsChange({ view: screen.view }), [screen.view])

  return (
    <Fragment>
      <div className="flex flex-col gap-4">
        <Heading1>Accounts</Heading1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Select value={screen.view} onValueChange={(value) => onScreenViewChange(withView(value))}>
            <SelectTrigger>
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
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
          Capital <InfoDialog copy={accountKindsManual.capital} />
        </Heading2>
        <ListForKind
          accounts={accounts.filter(({ kind, archivedAt }) => isCapital(kind) && screen.accountFilter(archivedAt))}
          kind="capital_normal"
          forArchived={inArchivedView}
          onOpenCreateChange={onOpenCreateChange}
        />
        <Heading2 className="flex gap-4 items-center">
          Savings <InfoDialog copy={accountKindsManual.savings} />
        </Heading2>
        <ListForKind
          accounts={accounts.filter(({ kind, archivedAt }) => isSavings(kind) && screen.accountFilter(archivedAt))}
          kind="capital_savings"
          forArchived={inArchivedView}
          onOpenCreateChange={onOpenCreateChange}
        />
        <Heading2 className="flex gap-4 items-center">
          Loans <InfoDialog copy={accountKindsManual.loans} />
        </Heading2>
        <ListForKind
          accounts={accounts.filter(({ kind, archivedAt }) => isLoan(kind) && screen.accountFilter(archivedAt))}
          kind="debt_loan"
          forArchived={inArchivedView}
          onOpenCreateChange={onOpenCreateChange}
        />
        <Heading2 className="flex gap-4 items-center">
          Personal debts <InfoDialog copy={accountKindsManual.personalDebt} />
        </Heading2>
        <ListForKind
          accounts={accounts.filter(({ kind, archivedAt }) => isPersonalDebt(kind) && screen.accountFilter(archivedAt))}
          kind="debt_personal"
          forArchived={inArchivedView}
          onOpenCreateChange={onOpenCreateChange}
        />
        <Heading2 className="flex gap-4 items-center">
          Credit <InfoDialog copy={accountKindsManual.credit} />
        </Heading2>
        <ListForKind
          accounts={accounts.filter(({ kind, archivedAt }) => isCredit(kind) && screen.accountFilter(archivedAt))}
          kind="debt_credit"
          forArchived={inArchivedView}
          onOpenCreateChange={onOpenCreateChange}
        />
      </div>
      <Drawer modal open={screen.openCreate} onOpenChange={(open) => !open && onOpenCreateChange(open, null)}>
        <DrawerContent className="overflow-clip">
          <DrawerHeader>
            <DrawerTitle>
              {
                {
                  capital_normal: "New Capital Account",
                  capital_savings: "New Savings Account",
                  debt_loan: "New Loan Account",
                  debt_personal: "New Personal loan Account",
                  debt_credit: "New Credit Account",
                }[screen.createKind!]
              }
            </DrawerTitle>
          </DrawerHeader>
          <CreateAccount
            open={screen.openCreate}
            onOpenChange={(open) => !open && onOpenCreateChange(false, null)}
            kind={screen.createKind}
            defaultCurrency="EUR"
            submitting={screen.submitting}
            onSubmitAction={onCreate}
          />
        </DrawerContent>
      </Drawer>
    </Fragment>
  )
}