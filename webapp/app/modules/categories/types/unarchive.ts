export type UnarchiveAction = (id: number, success: () => void, failure: () => void) => Promise<void>
export type OnSubmitUnarchiveAction = (id: number) => Promise<void>
