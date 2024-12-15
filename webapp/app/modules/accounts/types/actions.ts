export const INTENTS = {
  create: "create",
  update: "update",
  delete: "delete",
  archive: "archive",
  unarchive: "unarchive"
} as const

export type Intents = typeof INTENTS
