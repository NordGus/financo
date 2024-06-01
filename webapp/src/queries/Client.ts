import { QueryClient } from "@tanstack/react-query";

export const staleTimeDefault = 1000 * 30

const Client = new QueryClient()

export default Client