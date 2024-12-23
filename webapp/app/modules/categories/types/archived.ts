import { Kind } from "~/shared/types/account"
import { Icon } from "~/shared/types/icon"

export interface Archived {
  id: number
  name: string
  kind: Kind
  color: string
  icon: Icon
}