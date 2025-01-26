export type ArchiveAccountAction = (id: number, success: () => void, failure: () => void) => Promise<void>
export type OnSubmitArchiveAccountAction = (id: number) => Promise<void>
