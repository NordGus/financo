import { Kinds as SystemKinds } from "~/modules/shared/types/account";
import { Icon } from "~/modules/shared/types/icon";

type Kind = SystemKinds["expense"] | SystemKinds["income"]

type Child = {
  id: number
  kind: Kind
  name: string
  description?: string | null
  icon: Icon
  color: string
  archivedAt?: string | null
  deletedAt?: string | null
  createdAt: string
  updatedAt: string
  transactions: number
}

type Category = {
  id: number
  kind: Kind
  name: string
  description?: string | null
  icon: Icon
  color: string
  archivedAt?: string | null
  deletedAt?: string | null
  createdAt: string
  updatedAt: string
  transactions: number
  children: Child[]
}

export type { Category, Child, Kind };
