import { Entry } from "../../types/currency";

export async function list(): Promise<Entry[]> {
  const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/currencies`, { headers: { "Content-Type": "application/json; charset=UTF-8" } });

  if (response.ok) return response.json()

  throw response
}
