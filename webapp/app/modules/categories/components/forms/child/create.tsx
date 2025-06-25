import { zodResolver } from "@hookform/resolvers/zod";
import { TrashIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { IconInput } from "~/modules/shared/components/inputs/icon-input";
import { Throbber } from "~/modules/shared/components/throbber";
import { Button } from "~/modules/shared/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "~/modules/shared/components/ui/drawer";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "~/modules/shared/components/ui/form";
import { Input } from "~/modules/shared/components/ui/input";
import { Textarea } from "~/modules/shared/components/ui/textarea";
import { Icon } from "~/modules/shared/types/icon";
import { schema } from "../../../schemas/child/create";

interface Child {
  name: string
  description?: string
  icon: Icon
}

interface Props {
  action: "add" | "edit"
  child: Child
  defaultIcon: Icon
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Child) => void
  onDelete: () => void
  submitting?: boolean
}

export function ChildForm({
  action,
  child,
  open,
  defaultIcon,
  onOpenChange,
  onSubmit,
  onDelete,
  submitting = false
}: Props) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: undefined, icon: defaultIcon }
  })

  useEffect(() => {
    form.setValue("name", child.name)
    form.setValue("description", child.description)
    form.setValue("icon", child.icon)
  }, [child.name, child.description, child.icon])

  useEffect(() => { if (action === "add") form.reset() }, [open])

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {action === "add" ? "Add Child" : "Edit Child"}
          </DrawerTitle>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4 px-4">
              <div className="grid grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon</FormLabel>
                      <IconInput value={field.value} onChange={field.onChange} />
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
            </div>
            <DrawerFooter>
              <Button type="submit" disabled={submitting}>
                {
                  submitting
                    ? <Throbber size={"sm"} />
                    : action === "add"
                      ? "Add"
                      : "Update"
                }
              </Button>
              {
                action === "edit" && (
                  <Button type="button" onClick={onDelete} variant={"destructive"} disabled={submitting}>
                    <TrashIcon /> Delete
                  </Button>
                )
              }
              <DrawerClose asChild disabled={submitting}>
                <Button variant={"outline"}>Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  )
}