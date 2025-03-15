import { DynamicIcon } from "lucide-react/dynamic";
import { PropsWithChildren } from "react";
import { cn } from "~/lib/utils";
import { Button } from "~/modules/shared/components/ui/button";
import { colorContrast } from "~/modules/shared/helpers/color-contrast";
import { Account } from "../types/accounts";

interface Props {
  accounts: Map<number, Account>
  onClick: () => void
  selected: number[]
  className?: string
}

function Btn({ children, onClick, className }: PropsWithChildren<{ className?: string, onClick: () => void }>) {
  return (
    <Button
      size={"lg"}
      variant={"outline"}
      className={cn("[&_svg]:size-5", className)}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

export function AccountsFilter({ accounts, selected, onClick, className }: Props) {
  if (selected.length === 0) {
    return (
      <Btn className={className} onClick={onClick}>
        <span>All Accounts</span>
      </Btn>
    )
  }

  const account = accounts.get(selected[0])

  if (selected.length === 1 && account) {
    return (
      <Btn className={className} onClick={onClick}>
        <span className="rounded-md p-1" style={{ backgroundColor: account.color, color: colorContrast(account.color) }}>
          <DynamicIcon name={account.icon} />
        </span>
        <span>{account.name}</span>
      </Btn>
    )
  }

  return (
    <Btn className={className} onClick={onClick}>
      <span>{selected.length} Accounts</span>
    </Btn>
  )
}