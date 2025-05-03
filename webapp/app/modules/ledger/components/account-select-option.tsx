import { DynamicIcon } from "lucide-react/dynamic"
import { cn } from "~/lib/utils"
import { colorContrast } from "~/modules/shared/helpers/color-contrast"
import { Icon } from "~/modules/shared/types/icon"

interface Props {
  name: string
  icon: Icon
  color: string
  selected: boolean
  asCategory?: boolean
  onClick: () => void
}

export function AccountSelectOption({ name, icon, color, selected, onClick, asCategory = false }: Props) {
  return (
    <div
      className={cn(
        "border rounded-lg transition-all duration-500 text-xs gap-2 p-2 cursor-pointer flex items-center",
        asCategory && "rounded-full px-3"
      )}

      style={{
        borderColor: color,
        backgroundColor: selected ? color : undefined,
        color: selected ? colorContrast(color) : color
      }}

      onClick={onClick}
    >
      <DynamicIcon name={icon} className="size-6" /> {name}
    </div>
  )
}