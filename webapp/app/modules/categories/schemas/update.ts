import { z } from "zod";
import { IconsForZodEnum } from "~/modules/shared/types/icon";
import { DESCRIPTION_MAX_LENGTH, NAME_MAX_LENGTH, NAME_MIN_LENGTH } from "./constants";

export const schema = z.object({
  kind: z.union([z.literal("income"), z.literal("expense")]),
  color: z.string({ error: "required" })
    .max(10, { message: "invalid" }),
  icon: z.enum(IconsForZodEnum, { error: "invalid option" }),
  name: z.string({ error: "required" })
    .max(NAME_MAX_LENGTH, { error: "too long" })
    .min(NAME_MIN_LENGTH, { error: "too short" }),
  description: z.string()
    .max(DESCRIPTION_MAX_LENGTH, { error: "too long" })
    .nullish(),
  subcategories: z.array(z.union([
    z.object({
      id: z.number(),
      icon: z.enum(IconsForZodEnum, { error: "invalid option" }),
      name: z.string({ error: "required" })
        .max(NAME_MAX_LENGTH, { error: "too long" })
        .min(NAME_MIN_LENGTH, { error: "too short" }),
      description: z.string()
        .max(DESCRIPTION_MAX_LENGTH, { error: "too long" })
        .nullish(),
      intent: z.union([
        z.literal("update"),
        z.literal("destroy"),
        z.literal("archive"),
        z.literal("unarchive")
      ])
    }),
    z.object({
      id: z.undefined().nullish(),
      icon: z.enum(IconsForZodEnum, { error: "invalid option" }),
      name: z.string({ error: "required" })
        .max(NAME_MAX_LENGTH, { error: "too long" })
        .min(NAME_MIN_LENGTH, { error: "too short" }),
      description: z.string()
        .max(DESCRIPTION_MAX_LENGTH, { error: "too long" })
        .nullish(),
      intent: z.literal("create")
    })
  ])),
  intent: z.literal("update")
})