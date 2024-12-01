import { z } from "zod";
import { INTENTS } from "~/modules/accounts/types/actions";
import { KINDS } from "~/shared/types/account";
import { CURRENCIES } from "~/shared/types/currency";

export const schema = z.object({
  kind: z.nativeEnum(KINDS),
  name: z.string().trim().min(3).max(128),
  description: z.string().trim().max(256).optional(),
  currency: z.nativeEnum(CURRENCIES),
  capital: z.number(),
  color: z.string().refine((color) => {
    const validator = new Option().style;
    validator.color = color

    return validator.color.length > 0
  }, { message: `must be a valid color code` }),
  history: z.object({
    at: z.date().optional(),
    balance: z.number().optional()
  }),
  intent: z.nativeEnum(INTENTS)
});