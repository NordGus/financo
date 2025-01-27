import { Icon } from "~/modules/shared/types/icon";
import { ModuleKind } from "./account";

export const defaultIcons: Record<ModuleKind, Icon> = {
  capital_normal: "landmark",
  capital_savings: "piggy_bank",
  debt_loan: "hand_coins",
  debt_personal: "user",
  debt_credit: "credit_card",
}
