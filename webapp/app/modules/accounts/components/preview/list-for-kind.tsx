import { PlusIcon } from "lucide-react";
import { Button } from "~/shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "~/shared/components/ui/card";
import { Kind } from "~/shared/types/account";
import { Account } from "../../types/preview";
import { Preview } from "./card";

interface Props {
  accounts: Account[]
  forKind: Kind
  forArchived?: boolean
}

export function ListForKind({ accounts, forKind: __forKind, forArchived = false }: Props) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {accounts.map((account) => (
        <Preview key={`account.${account.id}`} account={account} />
      ))}
      {
        !forArchived && (
          <Button
            variant="link"
            className="flex justify-center items-center text-base leading-snug gap-2 h-auto p-6 border border-dashed"
          >
            <PlusIcon /> new
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