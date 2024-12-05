import { BookMarkedIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~/shared/components/ui/alert";
import { Copy } from "~/shared/types/copy";

export const hasIncompleteLedgerManual: Copy = {
  title: "What means that an Account has an incomplete ledger?",
  message: <>
    <p>
      For starters, according to <span className="text-foreground">dictionary.com</span>:
    </p>
    <Alert>
      <BookMarkedIcon className="w-4 h-4" />
      <AlertTitle className="mb-2">
        <a
          href="https://www.dictionary.com/browse/ledger"
          className="underline text-foreground"
          target="_blank"
          rel="noreferrer"
        >
          Ledger
        </a>
      </AlertTitle>
      <AlertDescription>
        <span className="italic">Bookkeeping</span>. an account book or digital file of final entry, in which business transactions are recorded.
      </AlertDescription>
    </Alert>
    <p>
      So, when you mark an Account as having an incomplete ledger, it means you do not have the complete Transaction history for the Account. You only have the balance in the Account from an given moment onward.
    </p>
    <p>
      Activating this option allows you to introduce this starting point and balance so <span className="font-bold text-foreground">financo</span> can help you to maintain your ledger.
    </p>
    <p>
      Please keep in mind that red numbers indicate a negative balance while black numbers are indicate a positive one.
    </p>
  </>
}