import { Create } from "./create"
import { Update } from "./update"

export type CreateAccountAction = (values: Create, success: () => void, failure: () => void) => Promise<void>
export type OnSubmitCreateAccountAction = (values: Create) => Promise<void>

export type UpdateAccountAction = (values: Update, success: () => void, failure: () => void) => Promise<void>
export type OnSubmitUpdateAccountAction = (values: Update) => Promise<void>

export type ArchiveAccountAction = (id: number, success: () => void, failure: () => void) => Promise<void>
export type OnSubmitArchiveAccountAction = (id: number) => Promise<void>

export type UnarchiveAccountAction = (id: number, success: () => void, failure: () => void) => Promise<void>
export type OnSubmitUnarchiveAccountAction = (id: number) => Promise<void>

export type DeleteAccountAction = (id: number, success: () => void, failure: () => void) => Promise<void>
export type OnSubmitDeleteAccountAction = (id: number) => Promise<void>

export const INTENTS = {
  create: "create",
  update: "update",
  delete: "delete",
  archive: "archive",
  unarchive: "unarchive"
} as const

export type Intents = typeof INTENTS
