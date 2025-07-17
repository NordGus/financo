import { Icon } from "~/modules/shared/types/icon";

export type UpdateSubcategory = {
  id: number
  icon: Icon
  name: string
  description: string | null | undefined
  intent: "update" | "archive" | "unarchive" | "destroy"
}

export type CreateSubcategory = {
  id?: null
  icon: Icon
  name: string
  description: string | null | undefined
  intent: "create"
}

export type Update = {
  id: number
  name: string
  description: string | null | undefined
  color: string
  icon: Icon
  subcategories: Array<UpdateSubcategory | CreateSubcategory>
}
