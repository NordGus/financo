import { Icon } from "~/modules/shared/types/icon";
import { ModuleKind } from "./account";

export const defaultIcons: Record<ModuleKind, Icon> = {
  capital: "landmark",
  savings: "piggy_bank",
  debt: "hand_coins",
  credit: "credit_card",
}
