export type DeleteAction = (id: number, success: () => void, failure: () => void) => Promise<void>
export type OnSubmitDeleteAction = (id: number) => Promise<void>

export type DeleteChildAction =
  (parentId: number, id: number, success: () => void, failure: () => void) => Promise<void>
export type OnSubmitDeleteChildAction =
  (parentId: number, id: number) => Promise<void>