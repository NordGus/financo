import { z } from "zod";
import { ICONS } from "~/modules/shared/types/icon";
import { ModuleKind } from "../types/category";

const KINDS: Record<ModuleKind, ModuleKind> = {
  expense: "expense",
  income: "income",
} as const

export const schema = z.object({
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