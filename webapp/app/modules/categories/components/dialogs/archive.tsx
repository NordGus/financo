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
import { Archived } from "../../types/archived";

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

export function ArchiveDialog({
  open, onOpenChanged, onSuccess, account: { id, name, transactions, children }
}: Props) {
  const [loading, setLoading] = useState(false)
  const fetcher = useFetcher<Archived | null>({ key: `archive.category.${id}` })

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
            You are about to archive <span className="font-bold">{name}</span>. This will remove it as an selectable option from the rest of <span className="font-bold text-foreground">financo</span> while preserving its <span className="font-bold">{transactions}</span> transaction(s) in your ledger and its <span className="font-bold">{children}</span> child(ren). <span className="font-bold">This action can be reverted from the Categories archive</span>.
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