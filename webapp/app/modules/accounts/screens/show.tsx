import { Heading1 } from "~/shared/components/ui/headings";
import { Account } from "../types/preview";

interface Props {
  account: Account
}

export function Screen({ account }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <Heading1>{account.name}</Heading1>
    </div>
  )
}