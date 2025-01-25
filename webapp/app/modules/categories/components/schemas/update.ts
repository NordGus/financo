import { z } from "zod";
import { CURRENCIES } from "~/shared/types/currency";
import { ICONS } from "~/shared/types/icon";

export const schema = z.object({
  id: z.number(),
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
    id: z.number(),
    name: z.string().trim().min(3).max(128),
    description: z.string().trim().max(256).optional(),
    icon: z.nativeEnum(ICONS),
    archivedAt: z.string().datetime().optional(),
  }).array(),
})