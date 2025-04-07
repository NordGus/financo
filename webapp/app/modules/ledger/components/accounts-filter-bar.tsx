import { XCircle } from "lucide-react"
import { DynamicIcon } from "lucide-react/dynamic"
import { ComponentProps, use } from "react"
import { cn } from "~/lib/utils"
import { Button } from "~/modules/shared/components/ui/button"
import { Kind } from "~/modules/shared/types/account"
import { AccountsContext } from "../contexts/accounts-context"

function isCategory(kind: Kind): boolean {
  switch (kind) {
    case "income":
    case "expense":
      return true
    default:
      return false
  }
}

type Props = {
  selected: number[]
  onSelectedClick: (id: number) => void
  forCategories?: boolean
}

export function AccountsFilterBar({ selected, onSelectedClick }: ComponentProps<"div"> & Props) {
  const { accountsMap } = use(AccountsContext)

  if (selected.length === 0) return null

  return (
    <div className="bg-background sticky top-0 z-30 flex gap-2 items-center px-4 py-2 border-b flex-wrap">
      {
        selected.map(id => {
          const account = accountsMap.get(id)

          if (!account) return null

          return (
            <Button
              asChild
              size={"sm"}
              variant={"outline"}
              key={`account.selected.filter.${id}`}
              style={{
                borderColor: account.color,
                color: account.color,
              }}
              onClick={() => onSelectedClick(id)}
              className={cn(
                "cursor-pointer ring-1",
                isCategory(account.kind) && "rounded-full"
              )}
            >
              <span>
                <DynamicIcon name={account.icon} />
                <span>{account.name}</span>
                <XCircle />
              </span>
            </Button>
          )
        })
      }
    </div>
  )
}