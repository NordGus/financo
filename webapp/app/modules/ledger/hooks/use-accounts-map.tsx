import { useMemo } from "react";
import { useLoaderData } from "react-router";
import { clientLoader } from "~/routes/ledger";
import { Accounts } from "../types/accounts";

/**
 * useAccountsMap is a custom hook that retrieves the accounts data from the
 * loader and maps it to a Map of account ID to account object.
 *
 * @returns {Accounts} A Map of account ID to account object.
 */
export function useAccountsMap() {
  const { accounts } = useLoaderData<typeof clientLoader>();

  const mapped = useMemo<Accounts>(() => {
    return new Map(accounts.map((account) => ([account.id, account])))
  }, [accounts])

  return mapped
}