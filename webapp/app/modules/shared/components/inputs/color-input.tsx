import { Edit2 } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { Button } from "../ui/button";
import { FormControl } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface Props {
  value: string
  onChange: (value: string) => void
}

export function ColorInput({ value, onChange }: Props) {
  return (
    <Tooltip>
      <Popover>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                size={"icon"}
                variant={"outline"}
                type={"button"}
              >
                <Edit2 />
              </Button>
            </FormControl>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>
          {"Change color"}
        </TooltipContent>
        <PopoverContent className="w-fit">
          <HexColorPicker color={value} onChange={onChange} />
        </PopoverContent>
      </Popover>
    </Tooltip>
  )
}