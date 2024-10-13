import { QueryClient } from "@tanstack/react-query";

export const staleTimeDefault = 1000 * 60 * 10

const Client = new QueryClient()

export default Client