import { zodResolver } from "@hookform/resolvers/zod";
import { PackageIcon, PackageOpenIcon, TrashIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { OnSubmitUpdateChildAction } from "~/modules/categories/types/update";
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
import { schema } from "../../../schemas/child/update";

interface Child {
  id: number
  parentId: number
  name: string
  description?: string
  icon: Icon
  archivedAt?: string | null
}

interface Props {
  child: Child
  open: boolean
  onOpenChange: (open: boolean) => void
  submitting: boolean
  onSubmit: OnSubmitUpdateChildAction
  onDelete: () => void
  onArchive: () => void
  onUnarchive: () => void
}

export function ChildForm({
  child,
  open,
  onOpenChange,
  submitting,
  onSubmit,
  onDelete,
  onArchive,
  onUnarchive,
}: Props) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { ...child }
  })

  useEffect(() => {
    form.setValue("id", child.id)
    form.setValue("parentId", child.parentId)
    form.setValue("name", child.name)
    form.setValue("description", child.description)
    form.setValue("icon", child.icon)
  }, [child.id, child.parentId, child.name, child.description, child.icon])

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
                !child.archivedAt && (
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
                child.archivedAt && (
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

              <Button
                variant={"destructive"}
                onClick={onDelete}
                disabled={submitting}
                type="button"
              >
                <TrashIcon /> Delete
              </Button>

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