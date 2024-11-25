import { PlusIcon } from "lucide-react";
import { Button } from "~/shared/components/ui/button";
import { Kind } from "~/shared/types/account";
import { Account } from "../../types/preview";
import { Preview } from "./card";

interface Props {
  accounts: Account[]
  forKind: Kind
  onNew: (kind: Kind) => void
}

export function ListForKind({ accounts, forKind, onNew }: Props) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {accounts.map((account) => (
        <Preview key={`account.${account.id}`} account={account} />
      ))}
      <Button
        variant="link"
        className="flex justify-center items-center text-base leading-snug gap-2 h-auto p-6 border border-dashed"
        onClick={() => onNew(forKind)}
      >
        <PlusIcon /> new
      </Button>
    </div>
  )
}