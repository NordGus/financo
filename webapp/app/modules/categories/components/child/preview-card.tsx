import { EditIcon, PackageIcon, PackageOpenIcon, TrashIcon } from "lucide-react"
import { Throbber } from "~/shared/components/throbber"
import { Button } from "~/shared/components/ui/button"
import { Card } from "~/shared/components/ui/card"
import { icons } from "~/shared/components/ui/icon"
import { Icon } from "~/shared/types/icon"

type Props = {
  name: string
  description?: string | null
  icon: Icon
  onEditClick: () => void
  onArchiveClick: () => void
  onUnarchiveClick: () => void
  onDeleteClick: () => void
  submitting: boolean
  create?: boolean
  archived?: boolean
}

export function PreviewCard({
  name,
  description,
  icon,
  onEditClick,
  onArchiveClick,
  onUnarchiveClick,
  onDeleteClick,
  submitting,
  create = false,
  archived = false
}: Props) {
  return (
    <Card>
      <div className="px-4 py-2 border-b min-h-12">
        <div
          className="flex items-center gap-2 text-md [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0"
        >
          {icons[icon]} <span>{name}</span>
        </div>
        {description && (
          <p className="text-muted-foreground text-sm">
            {description}
          </p>
        )}
      </div>
      <div className="flex flex-row">
        <Button
          type="button"
          size={"sm"}
          className="rounded-none shadow-none flex-1"
          variant={"link"}
          onClick={onEditClick}
          disabled={submitting}
        >
          {submitting ? <Throbber size={"sm"} /> : (<><EditIcon /> Edit</>)}
        </Button>
        {
          !create && !archived && (
            <Button
              type="button"
              size={"sm"}
              className="rounded-none shadow-none flex-1"
              variant={"secondary"}
              onClick={onArchiveClick}
              disabled={submitting}
            >
              {submitting ? <Throbber size={"sm"} /> : (<><PackageIcon /> Archive</>)}
            </Button>
          )
        }
        {
          !create && archived && (
            <Button
              type="button"
              size={"sm"}
              className="rounded-none shadow-none flex-1"
              variant={"secondary"}
              onClick={onUnarchiveClick}
              disabled={submitting}
            >
              {submitting ? <Throbber size={"sm"} /> : (<><PackageOpenIcon /> Unarchive</>)}
            </Button>
          )
        }
        <Button
          type="button"
          size={"sm"}
          className="rounded-none shadow-none flex-1"
          variant={"destructive"}
          onClick={onDeleteClick}
          disabled={submitting}
        >
          {submitting ? <Throbber size={"sm"} /> : (<><TrashIcon /> Delete</>)}
        </Button>
      </div>
    </Card>
  )
}