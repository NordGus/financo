import { Kind } from "~/shared/types/account"
import { Icon } from "~/shared/types/icon"

export type Archived = {
  id: number
  name: string
  kind: Kind
  color: string
  icon: Icon
}
