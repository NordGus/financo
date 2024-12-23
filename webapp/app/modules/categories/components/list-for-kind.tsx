import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "~/shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "~/shared/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "~/shared/components/ui/dialog";
import { Kind } from "~/shared/types/account";
import { Account } from "../types/preview";
import { Preview } from "./preview/card";

interface Props {
  accounts: Account[]
  kind: Kind
  archived: boolean
}

export function ListForKind({ accounts, archived }: Props) {
  const [openCreate, setOpenCreate] = useState(false)

  const isArchived = (archivedAt?: string | null) => archived ? !!archivedAt : !archivedAt

  return (
    <div className="grid grid-cols-4 gap-4">
      {
        !archived && (
          <Dialog modal open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button
                variant="link"
                className="flex justify-center items-center text-base leading-snug gap-2 h-auto p-6 border-2 border-dashed rounded-xl"
              >
                <PlusIcon /> New
              </Button>
            </DialogTrigger>
            <DialogContent>
              Create Category
            </DialogContent>
          </Dialog>
        )
      }
      {accounts.map((account) => <Preview key={`category.${account.id}`} account={account} isArchived={isArchived} />)}
      {
        archived && accounts.length === 0 && (
          <Card>
            <CardHeader></CardHeader>
            <CardContent className="text-muted-foreground text-center">
              No categories have been archived
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        )
      }
    </div>
  )
}