import { Icon } from "~/modules/shared/types/icon";
import { Kind } from "./category";

export type CreateChild = {
  name: string
  description?: string | null
  icon: Icon
}

export type Create = {
  kind: Kind
  name: string
  description?: string | null
  color: string,
  icon: Icon,
  children: CreateChild[]
}

export type Created = {
  id: number
  name: string
  kind: Kind
  color: string
  icon: Icon
}
