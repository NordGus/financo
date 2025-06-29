import { ComponentProps } from "react"
import { cn } from "~/lib/utils"
import { AccountListingIcon } from "~/modules/shared/components/icons/account-icon"
import { Icon } from "~/modules/shared/types/icon"
import { Kind } from "../../types/category"

type Props = {
  name: string
  kind: Kind
  description: string | null | undefined
  icon: Icon
  color: string
  archivedAt: string | null | undefined
  activeChildren?: number | null
  archivedChildren?: number | null
  selected?: boolean
}

export function CategoryPreview({
  name,
  kind,
  description,
  icon,
  color,
  archivedAt,
  activeChildren = 0,
  archivedChildren = 0,
  selected,
  className,
  ...props
}: ComponentProps<"span"> & Props) {
  return (
    <span
      className={
        cn(
          "grid grid-cols-[min-content_1fr] gap-2 cursor-pointer hover:bg-muted-foreground/20 p-2 rounded-lg",
          !!archivedAt && "opacity-80",
          className
        )
      }
      {...props}
    >
      <AccountListingIcon
        kind={kind}
        icon={icon}
        color={color}
        main={false}
        archived={!!archivedAt}
        className="row-span-2"
      />
      <span className="flex flex-col gap-1 [&_>*]:leading-none">
        <span>{name}</span>
        <span className="text-muted-foreground text-xs">{description}</span>
      </span>
      <span className="text-sm flex gap-4">
        {
          !!activeChildren && activeChildren > 0 && (
            <span>
              has {activeChildren} active {activeChildren === 1 ? "child" : "children"}
            </span>
          )
        }
        {
          !!archivedChildren && archivedChildren > 0 && (
            <span>
              has {archivedChildren} archived {archivedChildren === 1 ? "child" : "children"}
            </span>
          )
        }
      </span>
    </span>
  )
}