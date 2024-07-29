import { staleTimeDefault } from "./Client"
import { getAccounts } from "@api/accounts"

export const accountsForOtherContext = {
    queryKey: ['accounts', 'all', 'outside'],
    queryFn: getAccounts({ kind: [] }),
    staleTime: staleTimeDefault
}
