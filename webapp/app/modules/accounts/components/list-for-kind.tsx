import { Card } from "~/shared/components/ui/card";
import { accountKindToHuman } from "~/shared/helpers/account-kind-to-human";
import { ModuleKind } from "../types/account";
import { Account } from "../types/preview";
import { PreviewCard } from "./preview-card";

interface Props {
  accounts: Account[]
  kind: ModuleKind
  onSelectAccount: (account: Account) => void
  forArchived?: boolean
}

export function ListForKind({ accounts, kind, onSelectAccount, forArchived = false }: Props) {
  const filtered = accounts
    .filter((a) => a.kind === kind)
    .filter(({ archivedAt }) => forArchived ? !!archivedAt : !archivedAt)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {
        filtered.map((account) =>
          <PreviewCard
            key={`account.${account.id}`}
            account={account}
            onSelectAccount={onSelectAccount}
          />
        )
      }
      {
        filtered.length === 0 && (
          <Card className="text-muted-foreground text-center p-4">
            {
              forArchived
                ? `No ${accountKindToHuman(kind)} Accounts have been archived`
                : `No ${accountKindToHuman(kind)} Accounts are active`
            }
          </Card>
        )
      }
    </div>
  )
}