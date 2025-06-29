import { Plus } from "lucide-react"
import { ComponentProps, use } from "react"
import { createSearchParams, Link, Path, useLocation, useResolvedPath } from "react-router"
import { Button } from "~/modules/shared/components/ui/button"
import { accountKindToHuman } from "~/modules/shared/helpers/account-kind-to-human"
import { PureCategoryKind } from "~/modules/shared/types/account"
import { ListFiltersContext } from "../../contexts/list-filters-context"
import { listFiltersToURLSearchParams } from "../../types/filters"

type Props = {
  kind: PureCategoryKind
  to?: string | Path
}

export function NewForKindLink({ kind, to, children, ...props }: Props & ComponentProps<typeof Button>) {
  const { hash } = useLocation()
  const { pathname } = useResolvedPath("new", { relative: "path" })

  const { filters } = use(ListFiltersContext)

  return (
    <Button {...props} asChild>
      <Link
        to={to ?? {
          pathname: pathname,
          search: createSearchParams(listFiltersToURLSearchParams({ ...filters, kind })).toString(),
          hash
        }}
      >
        {
          !children
            ? (<><Plus /> {`You can create a new ${accountKindToHuman(kind)} Account here`}</>)
            : children
        }
      </Link>
    </Button>
  )
}