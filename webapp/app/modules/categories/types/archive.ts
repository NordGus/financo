export type ArchiveAction = (id: number, success: () => void, failure: () => void) => Promise<void>
export type OnSubmitArchiveAction = (id: number) => Promise<void>

export type ArchiveChildAction =
  (parentId: number, id: number, success: () => void, failure: () => void) => Promise<void>