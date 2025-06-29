import { DynamicIcon } from "lucide-react/dynamic";
import { Icon, ICONS } from "~/modules/shared/types/icon";
import { colorContrast } from "../../helpers/color-contrast";
import { Button } from "../ui/button";
import { FormControl } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const selectables = Object.values(ICONS)

interface Props {
  value: Icon
  onChange: (value: Icon) => void
  color?: string
}

export function IconInput({ value, onChange, color }: Props) {
  return (
    <Tooltip>
      <Popover>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                size={"icon"}
                className="size-12 cursor-pointer"
                style={{
                  backgroundColor: color ? colorContrast(color) : undefined,
                  color: color ? colorContrast(colorContrast(color)) : undefined
                }}
                type={"button"}
              >
                <DynamicIcon name={value} className="size-6" />
              </Button>
            </FormControl>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>
          {"Pick an Icon"}
        </TooltipContent>
        <PopoverContent className="overflow-clip max-h-[70dvh] overflow-y-auto no-scrollbar flex flex-wrap gap-2">
          {selectables.map((icon) => (
            <Button
              key={icon}
              variant={value === icon ? "secondary" : "ghost"}
              className="size-10 justify-center items-center m-auto"
              size={"icon"}
              onClick={() => onChange(icon)}
              type="button"
            >
              <DynamicIcon name={icon} className="size-7" />
            </Button>
          ))}
        </PopoverContent>
      </Popover>
    </Tooltip>
  )
}