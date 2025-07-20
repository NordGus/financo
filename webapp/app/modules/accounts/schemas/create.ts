import { z } from "zod";
import { CurrenciesForZodEnum } from "~/modules/shared/types/currency";
import { IconsForZodEnum } from "~/modules/shared/types/icon";
import {
  DESCRIPTION_MAX_LENGTH,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH
} from "./constants";

const capitalAndSavingsSchema = z.object({
  kind: z.union([z.literal("capital"), z.literal("savings")]),
  currency: z.enum(CurrenciesForZodEnum, { error: "invalid option" }),
  color: z.string({ error: "required" })
    .max(10, { error: "invalid" }),
  icon: z.enum(IconsForZodEnum, { error: "invalid option" }),
  name: z.string({ error: "required" })
    .max(NAME_MAX_LENGTH, { error: "too long" })
    .min(NAME_MIN_LENGTH, { error: "too short" }),
  description: z.string()
    .max(DESCRIPTION_MAX_LENGTH, { error: "too long" })
    .nullish(),
  capital: z.number({ error: "required" })
    .min(0, { message: "must be zero" })
    .max(0, { message: "must be zero" }),
  main: z.boolean({ error: "required" }),
  hasHistory: z.boolean({ error: "required" }),
  historyAt: z.iso.date({ error: "invalid" }).nullish(),
  historyBalance: z.number().nullish(),
  intent: z.literal("create", { error: "invalid action" })
})

const debtSchema = z.object({
  kind: z.literal("debt"),
  currency: z.enum(CurrenciesForZodEnum, { error: "invalid option" }),
  color: z.string({ error: "required" })
    .max(10, { error: "invalid" }),
  icon: z.enum(IconsForZodEnum, { error: "invalid option" }),
  name: z.string({ error: "required" })
    .max(NAME_MAX_LENGTH, { error: "too long" })
    .min(NAME_MIN_LENGTH, { error: "too short" }),
  description: z.string()
    .max(DESCRIPTION_MAX_LENGTH, { error: "too long" })
    .nullish(),
  capital: z.number({ error: "required" })
    .refine((val) => val !== 0, { error: "can't be zero" }),
  main: z.boolean({ error: "required" }),
  hasHistory: z.boolean({ error: "required" }),
  historyAt: z.iso.date({ error: "invalid" }).nullish(),
  historyBalance: z.number().nullish(),
  intent: z.literal("create", { error: "invalid action" })
})

const creditSchema = z.object({
  kind: z.literal("credit"),
  currency: z.enum(CurrenciesForZodEnum, { error: "invalid option" }),
  color: z.string({ error: "required" })
    .max(10, { error: "invalid" }),
  icon: z.enum(IconsForZodEnum, { error: "invalid option" }),
  name: z.string({ error: "required" })
    .max(NAME_MAX_LENGTH, { error: "too long" })
    .min(NAME_MIN_LENGTH, { error: "too short" }),
  description: z.string()
    .max(DESCRIPTION_MAX_LENGTH, { error: "too long" })
    .nullish(),
  capital: z.number({ error: "required" })
    .refine((val) => val !== 0, { error: "can't be zero" }),
  main: z.boolean({ error: "required" }),
  hasHistory: z.boolean({ error: "required" }),
  historyAt: z.iso.date({ error: "invalid" }).nullish(),
  historyBalance: z.number().nullish(),
  intent: z.literal("create", { error: "invalid action" })
})

export const schema = z.discriminatedUnion(
  "kind",
  [capitalAndSavingsSchema, debtSchema, creditSchema]
)

