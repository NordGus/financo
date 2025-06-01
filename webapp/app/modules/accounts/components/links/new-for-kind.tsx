import { Plus } from "lucide-react"
import { ComponentProps } from "react"
import { createSearchParams, Link, Path, useLocation, useResolvedPath } from "react-router"
import { Button } from "~/modules/shared/components/ui/button"
import { accountKindToHuman } from "~/modules/shared/helpers/account-kind-to-human"
import { AccountKind } from "~/modules/shared/types/account"

type Props = {
  kind: AccountKind
  to?: string | Path
}

export function NewForKindLink({ kind, to, children, ...props }: Props & ComponentProps<typeof Button>) {
  const { hash } = useLocation()
  const { pathname } = useResolvedPath("new", { relative: "path" })

  return (
    <Button {...props} asChild>
      <Link
        to={to ?? {
          pathname: pathname,
          search: createSearchParams({ new_kind: "capital" }).toString(),
          hash
        }}
      >
        {
          !children
            ? (<><Plus /> {`You can create a new ${accountKindToHuman(kind)} Account`}</>)
            : children
        }
      </Link>
    </Button>
  )
}