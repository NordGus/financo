import { PlusIcon } from "lucide-react";
import { Button } from "~/shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "~/shared/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "~/shared/components/ui/dialog";
import { isCapital, isCredit, isLoan, isPersonalDebt, isSavings, Kind } from "~/shared/types/account";
import { Account } from "../types/preview";
import { CreateCapitalAccount } from "./create-forms/capita";
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
  return (
    <div className="grid grid-cols-4 gap-4">
      {accounts.map((account) => (
        <Preview key={`account.${account.id}`} account={account} />
      ))}
      {
        !forArchived && (
          <Dialog modal>
            <DialogTrigger asChild>
              <Button
                variant="link"
                className="flex justify-center items-center text-base leading-snug gap-2 h-auto p-6 border border-dashed"
              >
                <PlusIcon /> New
              </Button>
            </DialogTrigger>
            <DialogContent>
              {isCapital(forKind) && <CreateCapitalAccount />}
              {isSavings(forKind) && <CreateSavingsAccount />}
              {isLoan(forKind) && <CreateLoanAccount />}
              {isPersonalDebt(forKind) && <CreatePersonalDebtAccount />}
              {isCredit(forKind) && <CreateCreditAccount />}
            </DialogContent>
          </Dialog>
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