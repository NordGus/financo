import { Entry } from "../../type/entry";

async function getEntriesForSelect(): Promise<Entry[]> {
  const response = await fetch("/api/currencies", { headers: { "Content-Type": "application/json; charset=UTF-8" } });

  if (response.ok) return response.json()

  throw response
}

export { getEntriesForSelect };
