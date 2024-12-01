import { ChevronRightIcon } from "lucide-react";
import { Copy } from "~/shared/types/copy";
import { Heading6 } from "../ui/headings";

export const calculatorManual: Copy = {
  title: "Some relevant information",
  message: <>
    <Heading6>About functionality</Heading6>
    <p>
      While you are operating over the amount you are inputting, ex. summing, subtracting, multiplying or dividing, the changes are not applied to the final value until you apply the value by pressing equal.
    </p>
    <Heading6>About your keyboard</Heading6>
    <p>
      When this calculator is active, <span className="font-bold text-foreground">it takes control of the following keys from your keyboard</span> for usability reasons:
    </p>
    <ul className="grid grid-cols-4 gap-2 font-bold">
      {["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "/", "*", "+", "-", "Enter", "Backspace"].map((name) => (
        <li
          key={`key.manual.${name}`}
          className="flex items-center leading-snug gap-2 [&_svg]:pointer-events-none [&_svg]:size-3 [&_svg]:shrink-0 text-muted-foreground"
        >
          <ChevronRightIcon /> {name}
        </li>
      ))}
    </ul>
  </>
}