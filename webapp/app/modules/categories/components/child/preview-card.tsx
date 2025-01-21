import { Card } from "~/shared/components/ui/card"
import { icons } from "~/shared/components/ui/icon"
import { Icon } from "~/shared/types/icon"

type Props = {
  name: string
  description?: string | null
  icon: Icon
  onClick: () => void
}

export function PreviewCard({ name, description, icon, onClick }: Props) {
  return (
    <Card className="px-4 py-3 cursor-pointer" onClick={onClick}>
      <div className="flex gap-2">
        {icons[icon]} <span className="font-semibold">{name}</span>
      </div>
      {description && (
        <p className="text-muted-foreground text-sm">
          {description}
        </p>
      )}
    </Card>
  )
}