import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { Throbber } from "~/shared/components/throbber";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "~/shared/components/ui/alert-dialog";
import { Button } from "~/shared/components/ui/button";
import { Unarchived } from "../../types/unarchive";

interface Account {
  id: number
  name: string
  transactions: number
  children: number
}

interface Props {
  open: boolean
  account: Account
  onOpenChanged: (open: boolean) => void
  onSuccess: () => void
}

export function UnarchiveDialog({ open, onOpenChanged, onSuccess, account: { id, name, children } }: Props) {
  const [loading, setLoading] = useState(false)
  const fetcher = useFetcher<Unarchived | null>({ key: `unarchive.category.${id}` })

  useEffect(() => {
    setLoading(false)

    if (loading && !!fetcher.data) onSuccess()
  }, [fetcher.data])

  return (
    <AlertDialog open={open} onOpenChange={onOpenChanged}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            You are about to unarchive <span className="font-bold">{name}</span> and its <span className="font-bold">{children}</span> child(ren). This will make it reappear as an selectable option in <span className="font-bold text-foreground">financo</span>. <span className="font-bold">This action can be reverted from the Categories</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {
            loading
              ? <Button variant={"ghost"} size={"icon"}>
                <Throbber size={"sm"} />
              </Button>
              : <>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button
                  onClick={() => {
                    setLoading(true)

                    fetcher.submit(
                      { intent: "unarchive" },
                      {
                        action: `/categories/${id}`,
                        method: "post",
                        encType: "application/json"
                      }
                    )
                  }}
                >
                  Confirm
                </Button>
              </>
          }
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}