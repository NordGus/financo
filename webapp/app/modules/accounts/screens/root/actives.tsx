import { useMemo } from "react";
import { InfoDialog } from "~/modules/shared/components/dialogs/info";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/modules/shared/components/ui/accordion";
import { Preview } from "../../components/preview";
import { accountKindsManual } from "../../manual/account-kinds-manual";
import { archivedAccountsManual } from "../../manual/archived-accounts-manual";
import { useAccountsStore } from "../../stores/accounts";
import { Account } from "../../types/account";

interface ScreenSections {
  capital: Account[]
  savings: Account[]
  archived: Account[]
}

interface Props {
  onAccountClick: (account: Account) => void
}

export function Screen({ onAccountClick }: Props) {
  const accounts = useAccountsStore((state => state.accounts))

  const sections = useMemo<ScreenSections>(() => {
    const entries = accounts.filter(({ kind }) => kind === "capital" || kind === "savings")

    return {
      capital: entries.filter((account) => account.kind === "capital" && !account.archivedAt),
      savings: entries.filter((account) => account.kind === "savings" && !account.archivedAt),
      archived: entries.filter(({ archivedAt }) => !!archivedAt)
    }
  }, [accounts])

  return (
    <>
      <div className="flex gap-2 items-center mb-2">
        <p className="text-2xl">Capital</p>
        <InfoDialog copy={accountKindsManual.capital} />
      </div>
      <div className="flex flex-col gap-2">
        {
          sections.capital.map((account) => (
            <Preview
              key={`account.${account.kind}.${account.id}`}
              account={account}
              onClick={() => onAccountClick(account)}
            />
          ))
        }
      </div>

      <div className="flex gap-2 items-center mb-2">
        <p className="text-2xl">Savings</p>
        <InfoDialog copy={accountKindsManual.savings} />
      </div>
      <div className="flex flex-col gap-2">
        {
          sections.savings.map((account) => (
            <Preview
              key={`account.${account.kind}.${account.id}`}
              account={account}
              onClick={() => onAccountClick(account)}
            />
          ))
        }
      </div>

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
    </>
  )
}