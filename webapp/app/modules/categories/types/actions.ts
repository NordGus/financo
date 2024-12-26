export const INTENTS = {
  create: "create",
  update: "update",
  delete: "delete",
  archive: "archive",
  unarchive: "unarchive"
} as const

export type Intents = typeof INTENTS

export type Intent =
  Intents["create"] |
  Intents["update"] |
  Intents["delete"] |
  Intents["archive"] |
  Intents["unarchive"]
