import { z } from "zod";
import { ICONS } from "~/shared/types/icon";

export const schema = z.object({
  name: z.string().trim().min(3).max(128),
  description: z.string().trim().max(256).optional(),
  icon: z.nativeEnum(ICONS),
})