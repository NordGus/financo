import { useMemo } from "react";
import { InfoDialog } from "~/modules/shared/components/dialogs/info";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/modules/shared/components/ui/accordion";
import { Preview } from "../../components/preview";
import { accountKindsManual } from "../../manual/account-kinds-manual";
import { archivedAccountsManual } from "../../manual/archived-accounts-manual";
import { useAccountsStore } from "../../stores/accounts";
import { Account } from "../../types/account";

interface ScreenSections {
  debts: Account[]
  credit: Account[]
  archived: Account[]
}

interface Props {
  onAccountClick: (account: Account) => void
}

export function Screen({ onAccountClick }: Props) {
  const accounts = useAccountsStore((state => state.accounts))

  const sections = useMemo<ScreenSections>(() => {
    const entries = accounts.filter(({ kind }) => kind === "debt" || kind === "credit")

    return {
      debts: entries.filter((account) => account.kind === "debt" && !account.archivedAt),
      credit: entries.filter((account) => account.kind === "credit" && !account.archivedAt),
      archived: entries.filter(({ archivedAt }) => !!archivedAt)
    }
  }, [accounts])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <p className="text-2xl">Debts</p>
        <InfoDialog copy={accountKindsManual.capital} />
      </div>
      {
        sections.debts.map((account) => (
          <Preview
            key={`account.${account.kind}.${account.id}`}
            account={account}
            onClick={() => onAccountClick(account)}
          />
        ))
      }

      <div className="flex gap-2 items-center">
        <p className="text-2xl">Credit</p>
        <InfoDialog copy={accountKindsManual.savings} />
      </div>
      {
        sections.credit.map((account) => (
          <Preview
            key={`account.${account.kind}.${account.id}`}
            account={account}
            onClick={() => onAccountClick(account)}
          />
        ))
      }

      <Accordion type="single" collapsible>
        <AccordionItem value="opened">
          <AccordionTrigger value="opened" className="text-2xl items-center">
            Archived
          </AccordionTrigger>
          <AccordionContent>
            <InfoDialog
              copy={archivedAccountsManual}
              withTitleInButton
              variant={"outline"}
              size={"default"}
              className="flex items-center justify-start w-full"
            />
            <div className="flex flex-col gap-2 mt-4">
              {
                sections.archived.map((account) => (
                  <Preview
                    key={`account.${account.kind}.${account.id}`}
                    account={account}
                    onClick={() => onAccountClick(account)}
                  />
                ))
              }
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}