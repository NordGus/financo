import { format } from "date-fns";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { Form } from "~/modules/shared/components/ui/form";

type Props = {
  onSubmit: () => void
}

export function FormTemplate({ }: Props) {
  const form = useForm({})
  const today = useRef<Date>(new Date())

  return (
    <Form {...form}>
      <div className="rounded-lg border">
        From account
      </div>
      <div className="rounded-lg border">
        To account
      </div>
      <div className="rounded-lg bg-zinc-700">
        Source amount
      </div>
      <div className="rounded-lg bg-zinc-700">
        Target amount
      </div>
      <div className="rounded-lg border">
        Issued {format(today.current, "LLL dd, y")}
      </div>
      <div className="rounded-lg border">
        Effective {format(today.current, "LLL dd, y")}
      </div>
      <div className="col-span-2">
        Date controls
      </div>
      <div className="rounded-lg border col-span-2">
        Notes
      </div>

      <div className="grid col-span-2 grid-cols-5 grid-rows-4 gap-2 mx-auto w-full max-w-[45dvh]">
        <div className="rounded-lg border aspect-square">div</div>
        <div className="rounded-lg border aspect-square">7</div>
        <div className="rounded-lg border aspect-square">8</div>
        <div className="rounded-lg border aspect-square">9</div>
        <div className="rounded-lg border aspect-square">back</div>
        <div className="rounded-lg border aspect-square">by</div>
        <div className="rounded-lg border aspect-square">4</div>
        <div className="rounded-lg border aspect-square">5</div>
        <div className="rounded-lg border aspect-square">6</div>
        <div className="rounded-lg border aspect-square">date</div>
        <div className="rounded-lg border aspect-square">minus</div>
        <div className="rounded-lg border aspect-square">1</div>
        <div className="rounded-lg border aspect-square">2</div>
        <div className="rounded-lg border aspect-square">3</div>
        <div className="rounded-lg border row-span-2">done</div>
        <div className="rounded-lg border aspect-square">plus</div>
        <div className="rounded-lg border aspect-square">curr</div>
        <div className="rounded-lg border aspect-square">0</div>
        <div className="rounded-lg border aspect-square">info</div>
      </div>
    </Form>
  )
}