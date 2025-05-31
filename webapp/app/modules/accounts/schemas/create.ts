import { z } from "zod";
import { CURRENCIES } from "~/modules/shared/types/currency";
import { ICONS } from "~/modules/shared/types/icon";
import { Kind } from "../types/accounts";

const KINDS: Record<Kind, Kind> = {
  capital: "capital",
  savings: "savings",
  credit: "credit",
  debt: "debt",
} as const

export const schema = z.object({
  kind: z.nativeEnum(KINDS),
  name: z.string().trim().min(3).max(128),
  description: z.string().trim().max(256).optional(),
  currency: z.nativeEnum(CURRENCIES),
  capital: z.number().safe(),
  color: z.string().refine((color) => {
    const validator = new Option().style;
    validator.color = color

    return validator.color.length > 0
  }, { message: `Must be a valid color code` }),
  icon: z.nativeEnum(ICONS),
  history: z.object({
    at: z.date().optional(),
    balance: z.number().optional()
  }),
  main: z.boolean(),
});

export const schemaWithCapital = z.object({
  kind: z.nativeEnum(KINDS),
  name: z.string().trim().min(3).max(128),
  description: z.string().trim().max(256).optional(),
  currency: z.nativeEnum(CURRENCIES),
  capital: z.number().safe().refine((num) => num !== 0, { message: "Required" }),
  color: z.string().refine((color) => {
    const validator = new Option().style;
    validator.color = color

    return validator.color.length > 0
  }, { message: `Must be a valid color code` }),
  icon: z.nativeEnum(ICONS),
  history: z.object({
    at: z.date().optional(),
    balance: z.number().optional()
  }),
  main: z.boolean(),
});