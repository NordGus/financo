import { Icon } from "~/shared/types/icon"
import { ModuleKind } from "./category"

export type Archived = {
  id: number
  name: string
  kind: ModuleKind
  color: string
  icon: Icon
}
