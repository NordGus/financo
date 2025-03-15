import { DynamicIcon } from "lucide-react/dynamic"
import { Card } from "~/modules/shared/components/ui/card"
import { Icon } from "~/modules/shared/types/icon"
import { Archived } from "../badges/archived"

type Props = {
  name: string
  description?: string | null
  icon: Icon
  archived: boolean
  onClick: () => void
}

export function PreviewCard({ name, description, icon, archived, onClick }: Props) {
  return (
    <Card className="px-4 py-3 cursor-pointer gap-0" onClick={onClick}>
      <div className="flex gap-2">
        <DynamicIcon name={icon} /> <span className="font-semibold">{name}</span>
      </div>
      {description && (
        <p className="text-muted-foreground text-sm">
          {description}
        </p>
      )}
      {archived && (
        <div className="mt-4 flex items-center gap-2 text-muted-foreground text-sm">
          <Archived /> Archived
        </div>
      )}
    </Card>
  )
}