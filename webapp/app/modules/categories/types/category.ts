import { Kinds } from "~/modules/shared/types/account";
import { Icon } from "~/modules/shared/types/icon";

type ModuleKind = Kinds["expense"] | Kinds["income"]

type Child = {
  id: number
  kind: ModuleKind
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
  kind: ModuleKind
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

export type { Category, Child, ModuleKind };
