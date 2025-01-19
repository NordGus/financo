import { Create } from "./create"
import { Update } from "./update"

export type CreateAccountAction = (values: Create, success: () => void, failure: () => void) => Promise<void>
export type OnSubmitCreateAccountAction = (values: Create) => Promise<void>

export type UpdateAccountAction = (values: Update, success: () => void, failure: () => void) => Promise<void>
export type OnSubmitUpdateAccountAction = (values: Update) => Promise<void>

export const INTENTS = {
  create: "create",
  update: "update",
  delete: "delete",
  archive: "archive",
  unarchive: "unarchive"
} as const

export type Intents = typeof INTENTS
