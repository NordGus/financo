import { Card } from "~/shared/components/ui/card";
import { accountKindToHuman } from "~/shared/helpers/account-kind-to-human";
import { ModuleKind } from "../types/account";
import { Account } from "../types/preview";
import { PreviewCard } from "./preview-card";

interface Props {
  accounts: Account[]
  kind: ModuleKind
  forArchived: boolean
  onClick: (account: Account) => void
}

export function ListForKind({ accounts, forArchived, kind, onClick }: Props) {
  const filtered = accounts
    .filter((account) => account.kind === kind)
    .filter(({ archivedAt }) => !!archivedAt === forArchived)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filtered.map((account) => (
        <PreviewCard
          key={`category.${account.id}`}
          account={account}
          onClick={() => onClick(account)}
        />
      ))}
      {
        filtered.length === 0 && (
          <Card className="text-muted-foreground text-center p-4">
            {
              forArchived
                ? `No ${accountKindToHuman(kind)} Categories have been archived`
                : `No ${accountKindToHuman(kind)} Categories are active`
            }
          </Card>
        )
      }
    </div>
  )
}