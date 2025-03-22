import { createContext, PropsWithChildren, useCallback, useReducer } from "react";
import { Kind } from "../types/transactions";

const DEFAULT_KIND: Kind = "income"
const DEFAULT_TARGET: number = -1
const DEFAULT_SOURCE: number = -1

export type OnTargetChangeCallback =
  () => void
export type OnSourceChangeCallback =
  () => void
export type OnResetCallback =
  () => void

type OnTargetChange =
  (kind: Kind, id: number, callback?: OnTargetChangeCallback) => void
type OnSourceChange =
  (id: number, callback?: OnSourceChangeCallback) => void
type OnReset =
  (callback?: OnResetCallback) => void

interface Creation {
  kind: Kind
  target: number
  source: number
  onTargetChange: OnTargetChange
  onSourceChange: OnSourceChange
  reset: OnReset
}

interface State {
  kind: Kind
  target: number
  source: number
}

const _actions = {
  TARGET_CHANGED: "TARGET_CHANGED",
  SOURCE_CHANGED: "SOURCE_CHANGED",
  RESET: "RESET"
} as const

type Actions = typeof _actions

type Action =
  { type: Actions["TARGET_CHANGED"], target: number, kind: Kind } |
  { type: Actions["SOURCE_CHANGED"], source: number } |
  { type: Actions["RESET"] }

export function creationReducer(state: State, action: Action): State {
  switch (action.type) {
    case "TARGET_CHANGED":
      return { ...state, kind: action.kind, target: action.target }
    case "SOURCE_CHANGED":
      return { ...state, source: action.source }
    case "RESET":
      return { ...state, kind: "income" }
  }
}

interface InitialState {
  kind?: Kind
  target?: number
  source?: number
}

export function init({
  kind = DEFAULT_KIND,
  target = DEFAULT_TARGET,
  source = DEFAULT_TARGET
}: InitialState): State {
  return { kind, target, source }
}

export const CreationContext = createContext<Creation>({
  kind: DEFAULT_KIND,
  target: DEFAULT_TARGET,
  source: DEFAULT_SOURCE,
  onTargetChange: (__kind, __id) => { },
  onSourceChange: (__id) => { },
  reset: () => { },
})

export function CreationContextProvider({ children }: PropsWithChildren) {
  const [{ kind, target, source }, dispatch] = useReducer(creationReducer, {}, init)

  const onTargetChange = useCallback<OnTargetChange>((kind, id, callback) => {
    dispatch({ type: "TARGET_CHANGED", kind, target: id })

    if (!callback) return
    callback()
  }, [dispatch])

  const onSourceChange = useCallback<OnSourceChange>((id, callback) => {
    dispatch({ type: "SOURCE_CHANGED", source: id })

    if (!callback) return
    callback()
  }, [dispatch])

  const reset = useCallback<OnReset>((callback) => {
    dispatch({ type: "RESET" })

    if (!callback) return
    callback()
  }, [dispatch])

  return (
    <CreationContext.Provider
      value={{
        kind,
        target,
        source,
        onTargetChange,
        onSourceChange,
        reset
      }}
    >
      {children}
    </CreationContext.Provider>
  )
}
