import { EditIcon } from "lucide-react";
import { Button } from "~/shared/components/ui/button";
import { Heading1 } from "~/shared/components/ui/headings";
import { Archive } from "../components/detail/actionables/archive";
import { Delete } from "../components/detail/actionables/delete";
import { Unarchive } from "../components/detail/actionables/unarchive";
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
          account.archivedAt
            ? <Unarchive account={account} />
            : <Archive account={account} />
        }
        <Delete account={account} />
      </div>
    </div>
  )
}