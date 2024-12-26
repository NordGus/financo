import { EditIcon } from "lucide-react"
import { Button } from "~/shared/components/ui/button"
import { icons } from "~/shared/components/ui/icon"
import { Icon } from "~/shared/types/icon"

interface Props {
  name: string
  description?: string
  icon: Icon
  onClick: () => void
}

export function Preview({ name, description, icon, onClick }: Props) {
  return (
    <div className="grid grid-rows-2 grid-cols-[minmax(0,_1fr)_50px] py-2">
      <span
        className="flex flex-row items-center text-lg gap-2 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0"
      >
        {icons[icon]} {name}
      </span>
      <span className="row-span-2 justify-self-end self-center">
        <Button type="button" variant={"outline"} size={"icon"} onClick={onClick}>
          <EditIcon />
        </Button>
      </span>
      <span className="text-muted-foreground text-sm">{description}</span>
    </div>
  )
}