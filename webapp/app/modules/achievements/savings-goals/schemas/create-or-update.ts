import z from "zod";
import { DESCRIPTION_MAX_LENGTH } from "~/modules/accounts/schemas/constants";
import { CurrenciesForZodEnum } from "~/modules/shared/types/currency";
import { NAME_MAX_LENGTH, NAME_MIN_LENGTH } from "./constants";

export const createSchema = z.object({
  name: z.string({ error: "required" })
    .max(NAME_MAX_LENGTH, { error: "too long" })
    .min(NAME_MIN_LENGTH, { error: "too short" }),
  description: z.string()
    .max(DESCRIPTION_MAX_LENGTH, { error: "too long" })
    .nullish(),
  target: z.number({ error: "required" })
    .gt(0, { message: "must be greater than zero" }),
  currency: z.enum(CurrenciesForZodEnum, { error: "invalid value" }),
  intent: z.literal("create"),
})

export const updateSchema = z.object({
  name: z.string({ error: "required" })
    .max(NAME_MAX_LENGTH, { error: "too long" })
    .min(NAME_MIN_LENGTH, { error: "too short" }),
  description: z.string()
    .max(DESCRIPTION_MAX_LENGTH, { error: "too long" })
    .nullish(),
  target: z.number({ error: "required" })
    .gt(0, { message: "must be greater than zero" }),
  currency: z.enum(CurrenciesForZodEnum, { error: "invalid value" }),
  intent: z.literal("update"),
})

export const formSchema = z.discriminatedUnion(
  "intent",
  [createSchema, updateSchema]
)