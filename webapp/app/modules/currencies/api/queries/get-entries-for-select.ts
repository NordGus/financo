import { Entry } from "../../type/entry";

async function getEntriesForSelect(): Promise<Entry[]> {
  const response = await fetch("/api/currencies");

  if (response.ok) return response.json()

  throw response
}

export { getEntriesForSelect };
