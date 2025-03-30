import { useLoaderData } from "react-router";
import { clientLoader } from "~/routes/ledger";

/**
 * useAccounts is a custom hook that retrieves the accounts data from the
 * loader and returns it as an array of account objects.
 *
 * @returns {Account[]} A Map of account ID to account object.
 */
export function useAccounts() {
  const { accounts } = useLoaderData<typeof clientLoader>();

  return accounts
}