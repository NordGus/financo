import { PackageOpenIcon } from "lucide-react"
import { FetcherWithComponents } from "react-router"
import { Account } from "~/modules/accounts/types/preview"
import { DropdownMenuItem } from "~/shared/components/ui/dropdown-menu"

interface Props {
  accountID: number
  fetcher: FetcherWithComponents<Account>
}

export function Unarchive({ accountID, fetcher }: Props) {
  return (
    <DropdownMenuItem
      onClick={() => {
        fetcher.submit(
          { intent: "unarchive" },
          {
            action: `/accounts/${accountID}`,
            method: "POST",
            encType: "application/json"
          }
        )
      }}
    >
      <PackageOpenIcon /> Unarchive
    </DropdownMenuItem>
  )
}