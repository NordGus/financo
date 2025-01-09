import { PlusIcon } from "lucide-react";
import { Fragment, useState } from "react";
import { Button } from "~/shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "~/shared/components/ui/card";
import { Drawer, DrawerContent } from "~/shared/components/ui/drawer";
import { isCapital, isCredit, isLoan, isPersonalDebt, isSavings, Kind } from "~/shared/types/account";
import { Account } from "../types/preview";
import { CreateCapitalAccount } from "./create-forms/capital";
import { CreateCreditAccount } from "./create-forms/credit";
import { CreateLoanAccount } from "./create-forms/loan";
import { CreatePersonalDebtAccount } from "./create-forms/personal-debt";
import { CreateSavingsAccount } from "./create-forms/savings";
import { Preview } from "./preview/card";

interface Props {
  accounts: Account[]
  forKind: Kind
  forArchived?: boolean
}

export function ListForKind({ accounts, forKind, forArchived = false }: Props) {
  const [openCreate, setOpenCreate] = useState(false)

  const onSuccess = () => setOpenCreate(false)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {accounts.map((account) => (
        <Preview key={`account.${account.id}`} account={account} />
      ))}
      {
        !forArchived && (
          <Fragment>
            <Button
              variant="link"
              className="flex justify-center items-center text-base leading-snug gap-2 h-auto p-6 border-2 border-dashed rounded-xl"
              onClick={() => setOpenCreate(true)}
            >
              <PlusIcon /> New
            </Button>
            <Drawer modal open={openCreate} onOpenChange={setOpenCreate}>
              <DrawerContent className="overflow-clip">
                {isCapital(forKind) && <CreateCapitalAccount onSuccess={onSuccess} keyId={accounts.length} />}
                {isSavings(forKind) && <CreateSavingsAccount onSuccess={onSuccess} keyId={accounts.length} />}
                {isLoan(forKind) && <CreateLoanAccount onSuccess={onSuccess} keyId={accounts.length} />}
                {isPersonalDebt(forKind) && <CreatePersonalDebtAccount onSuccess={onSuccess} keyId={accounts.length} />}
                {isCredit(forKind) && <CreateCreditAccount onSuccess={onSuccess} keyId={accounts.length} />}
              </DrawerContent>
            </Drawer>
          </Fragment>
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