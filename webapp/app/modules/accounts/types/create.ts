import { Create } from "./accounts"

export type CreateAccountAction = (values: Create, success: () => void, failure: () => void) => Promise<void>
export type OnSubmitCreateAccountAction = (values: Create) => Promise<void>