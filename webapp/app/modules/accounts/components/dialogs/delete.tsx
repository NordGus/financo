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

export function DeleteDialog({ open, onOpenChanged, account: { id, name, transactions } }: Props) {
  const [loading, setLoading] = useState(false)
  const fetcher = useFetcher<Deleted | null>({ key: `delete.account.${id}` })

  useEffect(() => {
    setLoading(false)

    if (loading && fetcher.data) onOpenChanged(false)
  }, [fetcher.data])

  return (
    <AlertDialog open={open} onOpenChange={onOpenChanged}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            You are about to permanently delete <span className="font-bold">{name}</span> from your Accounts and its related <span className="font-bold">{transactions}</span> transaction(s) from your ledger. <span className="font-bold">This action cannot be undone</span>.
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
                      { intent: "delete" },
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