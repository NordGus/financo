export type DeleteAction = (id: number, success: () => void, failure: () => void) => Promise<void>
export type OnSubmitDeleteAction = (id: number) => Promise<void>