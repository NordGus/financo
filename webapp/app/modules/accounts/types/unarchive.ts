export type UnarchiveAccountAction = (id: number, success: () => void, failure: () => void) => Promise<void>
export type OnSubmitUnarchiveAccountAction = (id: number) => Promise<void>
