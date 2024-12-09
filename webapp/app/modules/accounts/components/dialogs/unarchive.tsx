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
import { Deleted } from "../../types/delete";

interface Account {
  id: number
  name: string
  transactions: number
}

interface Props {
  open: boolean
  onOpenChanged: (open: boolean) => void
  account: Account
}

export function UnarchiveDialog({ open, onOpenChanged, account: { id, name } }: Props) {
  const [loading, setLoading] = useState(false)
  const fetcher = useFetcher<Deleted | null>({ key: `unarchive.account.${id}` })

  useEffect(() => {
    setLoading(false)

    if (loading && !!fetcher.data) onOpenChanged(false)
  }, [fetcher.data])

  return (
    <AlertDialog open={open} onOpenChange={onOpenChanged}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            You are about to unarchive <span className="font-bold">{name}</span>. This will make it reappear as an selectable option in <span className="font-bold text-foreground">financo</span>. <span className="font-bold">This action can be reverted from the Accounts</span>.
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
                      { intent: "archive" },
                      {
                        action: `/accounts/${id}`,
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