import { Create } from "./create"
import { Update } from "./update"

export const INTENTS = {
  create: "create",
  update: "update",
  delete: "delete",
  archive: "archive",
  unarchive: "unarchive"
} as const

export type CreateAction = (values: Create, success: () => void, failure: () => void) => Promise<void>
export type OnSubmitCreateAction = (values: Create) => Promise<void>

export type UpdateAction = (values: Update, success: () => void, failure: () => void) => Promise<void>
export type OnSubmitUpdateAction = (values: Update) => Promise<void>

export type DeleteAction = (id: number, success: () => void, failure: () => void) => Promise<void>
export type OnSubmitDeleteAction = (id: number) => Promise<void>

export type ArchiveAction = (id: number, success: () => void, failure: () => void) => Promise<void>
export type OnSubmitArchiveAction = (id: number) => Promise<void>

export type UnarchiveAction = (id: number, success: () => void, failure: () => void) => Promise<void>
export type OnSubmitUnarchiveAction = (id: number) => Promise<void>

export type Intents = typeof INTENTS

export type Intent =
  Intents["create"] |
  Intents["update"] |
  Intents["delete"] |
  Intents["archive"] |
  Intents["unarchive"]
