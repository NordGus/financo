import { Update } from "./accounts";

export type UpdateAccountAction = (values: Update, success: () => void, failure: () => void) => Promise<void>
export type OnSubmitUpdateAccountAction = (values: Update) => Promise<void>