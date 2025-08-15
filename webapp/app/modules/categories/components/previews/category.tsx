import { Package } from "lucide-react"
import { DynamicIcon } from "lucide-react/dynamic"
import { ComponentProps } from "react"
import { cn } from "~/lib/utils"
import { AccountListingIcon } from "~/modules/shared/components/icons/account-icon"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/modules/shared/components/ui/tooltip"
import { colorContrast as contrast } from "~/modules/shared/helpers/color-contrast"
import { Icon } from "~/modules/shared/types/icon"
import { Kind } from "../../types/category"

type Props = {
  name: string
  kind: Kind
  description: string | null | undefined
  icon: Icon
  color: string
  archivedAt: string | null | undefined
  selected?: boolean
}

export function CategoryPreview({
  name,
  kind,
  description,
  icon,
  color,
  archivedAt,
  selected,
  className,
  children,
  ...props
}: ComponentProps<"span"> & Props) {
  return (
    <span
      className={
        cn(
          "grid grid-cols-[min-content_1fr] gap-2 cursor-pointer hover:border-foreground! p-2.5 rounded-lg border border-transparent",
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
      <span className="*:text-xs flex gap-1 flex-wrap">
        {children}
      </span>
    </span>
  )
}

type ChildCategoryPreviewBodyProps = {
  color: string
  icon: Icon
  name: string
  archived: boolean
}

type ChildCategoryPreviewProps = {
  description: string | null | undefined
}

export function ChildCategoryPreview({
  color,
  icon,
  name,
  description,
  archived,
  className,
  style,
  ...props
}: ComponentProps<"span"> & ChildCategoryPreviewProps & ChildCategoryPreviewBodyProps) {
  if ((!description || description === "") && !archived) {
    return (
      <ChildCategoryPreviewBody
        name={name}
        color={color}
        icon={icon}
        archived={archived}
        {...props}
      />
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <ChildCategoryPreviewBody
          name={name}
          color={color}
          icon={icon}
          archived={archived}
          {...props}
        />
      </TooltipTrigger>
      <TooltipContent className="flex flex-col gap-1 max-w-[15dvw]">
        {description && description.length > 0 && (<span>{description}</span>)}
        {archived && (<span>{"This category is archived!"}</span>)}
      </TooltipContent>
    </Tooltip>
  )
}

export function ChildCategoryPreviewBody({
  color,
  icon,
  name,
  archived,
  className,
  style,
  ...props
}: ComponentProps<"span"> & ChildCategoryPreviewBodyProps) {
  return (
    <span
      {...props}
      className={cn("px-2 py-1 rounded-full shadow-md flex items-center gap-1", className)}
      style={{
        backgroundColor: color,
        color: contrast(color),
        ...style
      }}
    >
      <DynamicIcon name={icon} className="size-4" />
      <span>{name}</span>
      {archived && <Package className="size-4" />}
    </span>
  )
}