export type DeleteAccountAction = (id: number, success: () => void, failure: () => void) => Promise<void>
export type OnSubmitDeleteAccountAction = (id: number) => Promise<void>
