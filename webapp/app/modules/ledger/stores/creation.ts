import { create as createStore } from "zustand";
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

export type OnTargetChange =
  (kind: Kind, id: number, callback?: OnTargetChangeCallback) => void
export type OnSourceChange =
  (id: number, callback?: OnSourceChangeCallback) => void
export type OnReset =
  (callback?: OnResetCallback) => void

interface CreationState {
  kind: Kind
  target: number
  source: number
  onTargetChange: OnTargetChange
  onSourceChange: OnSourceChange
  reset: OnReset
}

const useCreationStore = createStore<CreationState>((set, get) => ({
  kind: DEFAULT_KIND,
  target: DEFAULT_TARGET,
  source: DEFAULT_SOURCE,
  onTargetChange: (kind, id, callback) => {
    if (kind === "income") set({ kind, source: id, target: DEFAULT_TARGET })
    else set({ kind, target: id, source: DEFAULT_SOURCE })

    if (!callback) return
    callback()
  },
  onSourceChange: (id, callback) => {
    const { kind } = get()

    if (kind === "income") set({ target: id })
    else set({ source: id })

    if (!callback) return
    callback()
  },
  reset: (callback) => {
    set({ kind: DEFAULT_KIND, target: DEFAULT_TARGET, source: DEFAULT_SOURCE })

    if (!callback) return
    callback()
  }
}))

export { useCreationStore };
