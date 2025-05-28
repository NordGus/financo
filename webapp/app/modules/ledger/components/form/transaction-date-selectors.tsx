import { format } from "date-fns"
import { Check, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "~/modules/shared/components/ui/button"
import { Calendar } from "~/modules/shared/components/ui/calendar"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/modules/shared/components/ui/dialog"

type IssuedAtProps = {
  value: Date
  onChange: (date: Date) => void
  disabled?: boolean
}

export function IssuedAt({ value, onChange, disabled }: IssuedAtProps) {
  const [date, setDate] = useState<Date | undefined>(value)

  useEffect(() => {
    setDate(value)
  }, [value])

  return (
    <Dialog onOpenChange={() => setDate(value)}>
      <Button asChild>
        <DialogTrigger disabled={disabled}>
          Issued {format(value, "PPP")}
        </DialogTrigger>
      </Button>
      <DialogContent className="sm:max-w-fit">
        <DialogHeader>
          <DialogTitle>
            {"Issue Date"}
          </DialogTitle>
          <DialogDescription>
            {"Select a Transaction Issue Date"}
          </DialogDescription>
        </DialogHeader>
        <Calendar
          defaultMonth={date}
          mode="single"
          selected={date}
          onSelect={(day) => setDate(day)}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant={"outline"} onClick={() => setDate(value)}>
              <X /> Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" disabled={!date} onClick={() => date && onChange(date)}>
              <Check /> Select
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

type ExecutedAtProps = {
  value: Date | null | undefined
  issuedAt: Date
  onChange: (date: Date | null | undefined) => void
  disabled?: boolean
}

export function ExecutedAt({ value, issuedAt, onChange, disabled }: ExecutedAtProps) {
  const [date, setDate] = useState<Date | undefined>(value ?? issuedAt)

  useEffect(() => {
    setDate(value ?? issuedAt)
  }, [value, issuedAt])

  return (
    <Dialog onOpenChange={() => setDate(value ?? issuedAt)}>
      <Button asChild>
        <DialogTrigger disabled={disabled}>
          {
            value
              ? `Effective ${format(value, "PPP")}`
              : "This transaction is pending"
          }
        </DialogTrigger>
      </Button>
      <DialogContent className="sm:max-w-fit">
        <DialogHeader>
          <DialogTitle>
            {"Execution Date"}
          </DialogTitle>
          <DialogDescription>
            {"Select a Transaction Execution Date"}
          </DialogDescription>
        </DialogHeader>
        <Calendar
          mode="single"
          selected={date ?? undefined}
          onSelect={(day) => setDate(day)}
          defaultMonth={date ?? issuedAt}
          disabled={(date) => Date.parse(date.toDateString()) < Date.parse(issuedAt.toDateString())}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant={"outline"} onClick={() => setDate(value ?? issuedAt)}>
              <X /> Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" disabled={!date} onClick={() => onChange(date ?? null)}>
              <Check /> Select
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}