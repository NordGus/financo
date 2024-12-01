import { Copy } from "~/shared/types/copy";
import { Heading6 } from "../ui/headings";

export const calculatorManual: Copy = {
  title: "Some relevant information",
  message: <>
    <Heading6>About your keyboard</Heading6>
    <p>
      When this calculator is active, it takes control of various keys from your keyboard for usability reasons.
    </p>
    <Heading6>About functionality</Heading6>
    <p>
      While you are operating over the amount you are inputting, ex. summing, subtracting, multiplying or dividing, the changes are not applied to the final value until you apply the value by pressing equal.
    </p>
  </>
}