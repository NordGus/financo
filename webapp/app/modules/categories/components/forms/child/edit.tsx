import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { existingChildCategoriesManual } from "~/modules/categories/manual/existing-child-categories-manual";
import { InfoAlert } from "~/shared/components/alerts/info";
import { IconInput } from "~/shared/components/inputs/icon-input";
import { Button } from "~/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "~/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "~/shared/components/ui/form";
import { Input } from "~/shared/components/ui/input";
import { Textarea } from "~/shared/components/ui/textarea";
import { Icon } from "~/shared/types/icon";
import { schema } from "../../schemas/child/update";

interface Child {
  id: number
  name: string
  description?: string
  icon: Icon
}

interface Props {
  action: "add" | "edit"
  child: Child
  onSubmit: (data: Child) => void
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultIcon: Icon
}

export function ChildForm({ action, child, open, defaultIcon, onOpenChange, onSubmit }: Props) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { id: -1, name: "", description: undefined, icon: defaultIcon }
  })

  useEffect(() => {
    form.setValue("id", child.id)
    form.setValue("name", child.name)
    form.setValue("description", child.description)
    form.setValue("icon", child.icon)
  }, [child.name, child.description, child.icon])

  useEffect(() => { if (action === "add") form.reset() }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {action === "add" ? "Add Child" : "Edit Child"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <InfoAlert copy={existingChildCategoriesManual} />
            <div className="grid grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <IconInput value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="You can add a little extra information about this Account."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    You can leave this empty
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"outline"}>Cancel</Button>
              </DialogClose>
              <Button type="submit">
                {action === "add" ? "Add" : "Edit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}