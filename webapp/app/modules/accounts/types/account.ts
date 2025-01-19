import { Kinds } from "~/shared/types/account";

export type ModuleKind =
  Kinds["capital_normal"] |
  Kinds["capital_savings"] |
  Kinds["debt_credit"] |
  Kinds["debt_loan"] |
  Kinds["debt_personal"]