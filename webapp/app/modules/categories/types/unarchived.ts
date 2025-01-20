import { Icon } from "~/shared/types/icon"
import { ModuleKind } from "./account"

export type Unarchived = {
  id: number
  name: string
  kind: ModuleKind
  color: string
  icon: Icon
}
