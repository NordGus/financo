import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { redirect } from "react-router";
import { cn } from "~/lib/utils";
import { Button } from "~/shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "~/shared/components/ui/card";
import { Drawer, DrawerContent } from "~/shared/components/ui/drawer";
import { Kind } from "~/shared/types/account";
import { Account } from "../types/preview";
import { CreateCategory } from "./forms/create";
import { Preview } from "./preview/card";

const SECOND_BUTTON_HIDDEN_COUNT = 5

interface Props {
  accounts: Account[]
  kind: Kind
  archived: boolean
}

interface NewCategoryButtonProps {
  archived: boolean
  onClick: () => void
  className?: string
}

function NewCategoryButton({ archived, onClick, className }: NewCategoryButtonProps) {
  if (archived) return null

  return (
    <Button
      variant="link"
      className={cn(
        "flex justify-center items-center text-base leading-snug gap-2 h-auto p-6 border-2 border-dashed rounded-xl",
        className
      )}
      onClick={onClick}
    >
      <PlusIcon /> New
    </Button>
  )
}

export function ListForKind({ accounts, archived, kind }: Props) {
  const [openCreate, setOpenCreate] = useState(false)

  const isArchived = (archivedAt?: string | null) => archived ? !!archivedAt : !archivedAt

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <NewCategoryButton
        archived={archived}
        onClick={() => setOpenCreate(true)}
      />

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

      <NewCategoryButton
        archived={archived}
        onClick={() => setOpenCreate(true)}
        className={cn("lg:hidden", accounts.length < SECOND_BUTTON_HIDDEN_COUNT && "hidden")}
      />

      {
        !archived && (
          <Drawer modal open={openCreate} onOpenChange={setOpenCreate}>
            <DrawerContent>
              <CreateCategory
                kind={kind}
                defaultCurrency={"EUR"}
                onSuccess={() => {
                  setOpenCreate(false)

                  redirect(".")
                }}
              />
            </DrawerContent>
          </Drawer>
        )
      }
    </div>
  )
}