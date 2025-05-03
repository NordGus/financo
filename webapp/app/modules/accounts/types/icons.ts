import { Icon } from "~/modules/shared/types/icon";
import { ModuleKind } from "./account";

export const defaultIcons: Record<ModuleKind, Icon> = {
  capital: "landmark",
  savings: "piggy-bank",
  debt: "hand-coins",
  credit: "credit-card",
}
