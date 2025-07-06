import { z } from "zod";
import { ICONS } from "~/modules/shared/types/icon";
import { Kind } from "../types/category";
import { DESCRIPTION_MAX_LENGTH, NAME_MAX_LENGTH, NAME_MIN_LENGTH } from "./constants";

const KINDS: Record<Kind, Kind> = {
  expense: "expense",
  income: "income",
} as const

export const oldSchema = z.object({
  kind: z.nativeEnum(KINDS),
  name: z.string().trim().min(3).max(128),
  description: z.string().trim().max(256).optional(),
  color: z.string().refine((color) => {
    const validator = new Option().style;
    validator.color = color

    return validator.color.length > 0
  }, { message: `must be a valid color code` }),
  icon: z.nativeEnum(ICONS),
  children: z.object({
    name: z.string().trim().min(3).max(128),
    description: z.string().trim().max(256).optional(),
    icon: z.nativeEnum(ICONS),
  }).array(),
})

const expenseSchema = z.object({
  kind: z.literal("expense"),
  color: z.string({ required_error: "required" })
    .max(10, { message: "invalid" }),
  icon: z.nativeEnum(ICONS, { required_error: "required", message: "invalid option" }),
  name: z.string({ required_error: "required" })
    .max(NAME_MAX_LENGTH, { message: "too long" })
    .min(NAME_MIN_LENGTH, { message: "too short" }),
  description: z.string()
    .max(DESCRIPTION_MAX_LENGTH, { message: "too long" })
    .nullish(),
  subcategories: z.array(
    z.object({
      kind: z.literal("expense"),
      icon: z.nativeEnum(ICONS, { required_error: "required", message: "invalid option" }),
      name: z.string({ required_error: "required" })
        .max(NAME_MAX_LENGTH, { message: "too long" })
        .min(NAME_MIN_LENGTH, { message: "too short" }),
      description: z.string()
        .max(DESCRIPTION_MAX_LENGTH, { message: "too long" })
        .nullish(),
      intent: z.literal("create")
    })
  ),
  intent: z.literal("create")
})

const incomeSchema = z.object({
  kind: z.literal("income"),
  color: z.string({ required_error: "required" })
    .max(10, { message: "invalid" }),
  icon: z.nativeEnum(ICONS, { required_error: "required", message: "invalid option" }),
  name: z.string({ required_error: "required" })
    .max(NAME_MAX_LENGTH, { message: "too long" })
    .min(NAME_MIN_LENGTH, { message: "too short" }),
  description: z.string()
    .max(DESCRIPTION_MAX_LENGTH, { message: "too long" })
    .nullish(),
  subcategories: z.array(
    z.object({
      kind: z.literal("income"),
      icon: z.nativeEnum(ICONS, { required_error: "required", message: "invalid option" }),
      name: z.string({ required_error: "required" })
        .max(NAME_MAX_LENGTH, { message: "too long" })
        .min(NAME_MIN_LENGTH, { message: "too short" }),
      description: z.string()
        .max(DESCRIPTION_MAX_LENGTH, { message: "too long" })
        .nullish(),
      intent: z.literal("create")
    })
  ),
  intent: z.literal("create")
})

export const schema = z.union([expenseSchema, incomeSchema])
