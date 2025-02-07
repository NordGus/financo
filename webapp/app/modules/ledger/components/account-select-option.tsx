import { cn } from "~/lib/utils"
import { icons } from "~/modules/shared/components/ui/icon"
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
        "border-2 rounded-lg transition-all duration-500 flex text-sm gap-2 py-1 px-2 min-h-12 cursor-pointer",
        asCategory && "rounded-full"
      )}

      style={{
        borderColor: color,
        backgroundColor: selected ? color : undefined,
        color: selected ? colorContrast(color) : color
      }}

      onClick={onClick}
    >
      <span className="[&_svg]:size-6 my-auto">{icons[icon]}</span> {name}
    </div>
  )
}