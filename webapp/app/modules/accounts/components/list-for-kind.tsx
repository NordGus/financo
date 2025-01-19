import { PlusIcon } from "lucide-react";
import { Button } from "~/shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "~/shared/components/ui/card";
import { ModuleKind } from "../types/account";
import { Account } from "../types/preview";
import { Preview } from "./preview/card";

interface Props {
  accounts: Account[]
  kind: ModuleKind
  forArchived?: boolean,
  onOpenCreateChange: (open: boolean, kind: ModuleKind | null) => void
}

export function ListForKind({ accounts, kind, onOpenCreateChange, forArchived = false }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {
        accounts.map((account) => <Preview key={`account.${account.id}`} account={account} />)
      }
      {
        !forArchived && (
          <Button
            variant="link"
            className="flex justify-center items-center text-base leading-snug gap-2 h-auto p-6 border-2 border-dashed rounded-xl"
            onClick={() => onOpenCreateChange(true, kind)}
          >
            <PlusIcon /> New
          </Button>
        )
      }
      {
        forArchived && accounts.length === 0 && (
          <Card>
            <CardHeader></CardHeader>
            <CardContent className="text-muted-foreground text-center">
              No accounts have been archived
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        )
      }
    </div>
  )
}