import { cn } from "@/lib/utils"
import { SavingsGoal } from "@/types/savings-goal"
import { Button } from "@components/ui/button"
import { buttonVariants } from "@components/ui/button-variants"
import { Calendar } from "@components/ui/calendar"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import moment from "moment"
import { useState } from "react"
import { Form } from "react-router-dom"

interface MarkAsAchievedProps {
    goal: SavingsGoal
    onSetOpenForm: (open: boolean) => void
}

export function MarkAsAchieved({ goal, onSetOpenForm }: MarkAsAchievedProps) {
    const [achievedAt, setAchievedAt] = useState<Date | undefined>(moment().toDate())
    const maxDate = moment().endOf('day').toDate()

    if (goal.settings.saved < goal.settings.target) return null

    return (
        <Dialog>
            <div className="flex flex-col pt-4">
                <DialogTrigger asChild>
                    <Button variant="secondary">Mark as Achieved</Button>
                </DialogTrigger>
            </div>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone.
                        This will permanently mark <span className="font-bold">{goal.name}</span> as achieved goal.
                    </DialogDescription>
                </DialogHeader>
                <Popover>
                    <PopoverTrigger
                        className={
                            cn(
                                buttonVariants({
                                    variant: "outline",
                                    size: "default",
                                    className: cn(
                                        "pl-3 text-left font-normal",
                                        !achievedAt && "text-zinc-500"
                                    )
                                }),
                            )
                        }
                    >
                        {achievedAt ? (
                            format(achievedAt, "PPP")
                        ) : (
                            <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center">
                        <Calendar
                            mode="single"
                            selected={achievedAt}
                            onSelect={setAchievedAt}
                            disabled={(date) => date >= maxDate}
                        />
                    </PopoverContent>
                </Popover>
                <DialogDescription className="text-left">
                    When did you achieved this goal?
                </DialogDescription>
                <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                    <DialogClose className={cn(buttonVariants({ variant: "secondary", size: "default" }))}>
                        Cancel
                    </DialogClose>
                    <Form
                        className="inline-flex p-0 m-0"
                        method="post"
                        action={`/achievements/savings-goals/${goal.id}/mark-as-achieved`}
                        onSubmit={() => onSetOpenForm(false)}
                    >
                        <input
                            type="hidden"
                            name="id"
                            value={goal.id}
                        />
                        <input
                            type="hidden"
                            name="achievedAt"
                            value={achievedAt?.toISOString() ?? ""}
                        />
                        <DialogClose
                            type="submit"
                            className={cn(buttonVariants({ variant: "default", size: "default" }))}
                            disabled={!achievedAt ? true : achievedAt > maxDate}
                        >
                            Confirm
                        </DialogClose>
                    </Form>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}
