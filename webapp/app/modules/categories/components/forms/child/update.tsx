import { zodResolver } from "@hookform/resolvers/zod";
import { PackageIcon, PackageOpenIcon, TrashIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { IconInput } from "~/shared/components/inputs/icon-input";
import { Throbber } from "~/shared/components/throbber";
import { Button } from "~/shared/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "~/shared/components/ui/drawer";
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
  name: string
  description?: string
  icon: Icon
}

interface Props {
  child: Child
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultIcon: Icon
  submitting: boolean
  onSubmit: (data: Child) => void
  onDelete?: () => void
  onArchive?: () => void
  onUnarchive?: () => void
}

export function ChildForm({
  child,
  open,
  defaultIcon,
  onOpenChange,
  submitting,
  onSubmit,
  onDelete,
  onArchive,
  onUnarchive,
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

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Update Child</DrawerTitle>
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
            </div>
            <DrawerFooter>
              <Button type="submit" disabled={submitting}>
                {submitting ? <Throbber /> : "Update"}
              </Button>
              {
                onArchive && (
                  <Button
                    variant={"secondary"}
                    onClick={onArchive}
                    disabled={submitting}
                    type="button"
                  >
                    <PackageIcon /> Archive
                  </Button>
                )
              }
              {
                onUnarchive && (
                  <Button
                    variant={"secondary"}
                    onClick={onUnarchive}
                    disabled={submitting}
                    type="button"
                  >
                    <PackageOpenIcon /> Unarchive
                  </Button>
                )
              }
              {
                onDelete && (
                  <Button
                    variant={"destructive"}
                    onClick={onDelete}
                    disabled={submitting}
                    type="button"
                  >
                    <TrashIcon /> Delete
                  </Button>
                )
              }
              <DrawerClose asChild disabled={submitting}>
                <Button variant={"outline"} type="button">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  )
}