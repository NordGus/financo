import { useReducer } from "react";
import { useLocation, useNavigation } from "react-router";
import { cn } from "~/lib/utils";
import { FormTemplate } from "~/modules/ledger/components/form-template";
import { TransactionSourcePicker } from "~/modules/ledger/components/transaction-source-picker";
import { TransactionTargetPicker } from "~/modules/ledger/components/transaction-target-picker";
import { AccountsContextProvider } from "~/modules/ledger/contexts/accounts-context";
import { Kind } from "~/modules/ledger/types/transactions";
import { FullScreenThrobber } from "~/modules/shared/components/throbber";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/modules/shared/components/ui/card";
import { CurrenciesContextProvider } from "~/modules/shared/contexts/currencies-context";
import { Currency } from "~/modules/shared/types/currency";
import { Route } from "./+types/new";

export function clientLoader({ }: Route.ClientLoaderArgs) {
  return { breadcrumb: "New Transaction" }
}

export function clientAction({ }: Route.ClientActionArgs) { }

const DEFAULT_KIND: Kind = "income"
const DEFAULT_TARGET: number = -1
const DEFAULT_SOURCE: number = -1

type State = {
  sourceId: number
  targetId: number
  kind: Kind
  stage: "target" | "source" | "form"
}

const _actions = {
  TARGET_CHANGED: "TARGET_CHANGED",
  SOURCE_CHANGED: "SOURCE_CHANGED"
} as const

type Actions = typeof _actions

type Action =
  { type: Actions["TARGET_CHANGED"], id: number, kind: Kind } |
  { type: Actions["SOURCE_CHANGED"], id: number }

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case _actions.TARGET_CHANGED:
      return {
        ...state,
        kind: action.kind,
        sourceId: action.kind === "income" ? action.id : DEFAULT_SOURCE,
        targetId: action.kind === "income" ? DEFAULT_TARGET : action.id,
        stage: "source"
      }
    case _actions.SOURCE_CHANGED:
      return {
        ...state,
        stage: "form",
        ...state.kind === "income"
          ? { targetId: action.id }
          : { sourceId: action.id }
      }
  }
}

export function init(): State {
  return {
    sourceId: DEFAULT_SOURCE,
    targetId: DEFAULT_TARGET,
    kind: DEFAULT_KIND,
    stage: "target"
  }
}

export default function New({ matches }: Route.ComponentProps) {
  // extracting data from webapp/app/modules/shared/layout.tsx's loader.
  const { data: { currencies } } = matches[1]
  // extracting data from webapp/app/routes/ledger/_layout.tsx's loader.
  const { data: { accounts, accountsMap } } = matches[2]

  const { pathname } = useLocation() // current location
  const { state: navigationState, location } = useNavigation() // navigation location

  const [state, setState] = useReducer(reducer, {}, init)


  return (
    <CurrenciesContextProvider currencies={currencies}>
      <AccountsContextProvider accounts={accounts} accountsMap={accountsMap}>
        <section className="flex flex-col h-full max-h-full py-4 overflow-hidden relative">
          <FullScreenThrobber
            className={cn(
              "absolute inset-0 z-50",
              (navigationState === "idle" || location.pathname === pathname) && "hidden"
            )}
          />
          {
            state.stage === "target" && (
              <Card className="flex-grow h-full max-h-full">
                <CardHeader>
                  <CardTitle>Register a Transaction</CardTitle>
                  <CardDescription>
                    {"What kind of transaction you want to register?"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col grow overflow-hidden">
                  <TransactionTargetPicker
                    selected={null}
                    onSelected={(kind, id) => setState({ type: _actions.TARGET_CHANGED, kind, id })}
                  />
                </CardContent>
              </Card >
            )
          }
          {
            state.stage === "source" && (
              <Card className="flex-grow h-full max-h-full">
                <CardHeader>
                  <CardTitle>
                    {
                      state.kind === "income"
                        ? "To Account"
                        : "From Account"
                    }
                  </CardTitle>
                  <CardDescription>
                    {
                      state.kind === "income"
                        ? "Select the Transaction's target Account"
                        : "Select the Transaction's source Account"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col grow overflow-hidden">
                  <TransactionSourcePicker
                    selected={null}
                    target={state.kind === "income" ? state.sourceId : state.targetId}
                    onSelected={(id) => setState({ type: _actions.SOURCE_CHANGED, id })}
                  />
                </CardContent>
              </Card >
            )
          }
          {
            state.stage === "form" && (
              <FormTemplate
                transaction={{
                  sourceId: state.sourceId,
                  targetId: state.targetId,
                  sourceAmount: 0,
                  targetAmount: 0,
                  issuedAt: new Date(),
                  executedAt: null,
                  notes: null,
                  currency: accountsMap.get(state.sourceId)!.currency === "MULTI"
                    // This value is going to be a Currency because is not possible to create a transaction between
                    // Accounts with MULTI currency
                    ? accountsMap.get(state.targetId)!.currency as Currency
                    // This value is going to be a Currency because is not possible to create a transaction between
                    // Accounts with MULTI currency
                    : accountsMap.get(state.sourceId)!.currency as Currency,
                  kind: state.kind
                }}
                role="create"
              />
            )
          }
        </section>
      </AccountsContextProvider>
    </CurrenciesContextProvider>
  )
}
