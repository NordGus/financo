import { z } from "zod";
import { CURRENCIES } from "~/shared/types/currency";
import { ICONS } from "~/shared/types/icon";

export const schema = z.object({
  id: z.number(),
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
  id: z.number(),
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