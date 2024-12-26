import { z } from "zod";
import { KINDS } from "~/shared/types/account";
import { CURRENCIES } from "~/shared/types/currency";
import { ICONS } from "~/shared/types/icon";
import { INTENTS } from "../../types/actions";

export const schema = z.object({
  kind: z.nativeEnum(KINDS),
  name: z.string().trim().min(3).max(128),
  description: z.string().trim().max(256).optional(),
  currency: z.nativeEnum(CURRENCIES),
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
  intent: z.nativeEnum(INTENTS)
})