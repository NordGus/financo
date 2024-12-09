import { EditIcon, PackageIcon, PackageOpenIcon } from "lucide-react";
import { Button } from "~/shared/components/ui/button";
import { Heading1 } from "~/shared/components/ui/headings";
import { Delete } from "../components/detail/actionables/delete";
import { Account } from "../types/preview";

interface Props {
  account: Account
}

export function Screen({ account }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4 items-center">
        <Heading1>{account.name}</Heading1>
        <span className="grow" />
        <Button>
          <EditIcon /> Edit
        </Button>
        {
          !account.archivedAt
            ? (
              <Button variant="outline">
                <PackageIcon /> Archive
              </Button>
            )
            : (
              <Button variant="outline">
                <PackageOpenIcon /> Unarchive
              </Button>
            )
        }
        <Delete account={account} />
      </div>
    </div>
  )
}