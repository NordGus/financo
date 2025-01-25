import { getEntriesForSelect } from "~/modules/currencies/api/queries/get-entries-for-select";
import { Route } from "./+types/for-select";


export async function clientLoader({ }: Route.ClientLoaderArgs) {
  const currencies = await getEntriesForSelect()

  return { currencies };
}