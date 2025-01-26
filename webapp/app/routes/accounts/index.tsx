import { useCallback, useEffect } from "react";
import { URLSearchParamsInit, useSearchParams } from "react-router";
import { toast } from "sonner";
import { Screen } from "~/modules/accounts/screens";
import { useAccountsStore } from "~/modules/accounts/stores/accounts";
import { Create } from "~/modules/accounts/types/create";
import { Update } from "~/modules/accounts/types/update";
import { Route } from "./+types/index";

export async function clientLoader({ }: Route.ClientLoaderArgs) {
  return { breadcrumb: "Accounts" }
}

export default function Index() {
  const accounts = useAccountsStore((state) => state.accounts)

  const listQuery = useAccountsStore((state) => state.list)

  const createAction = useAccountsStore((state) => state.create)
  const updateAction = useAccountsStore((state) => state.update)
  const archiveAction = useAccountsStore((state) => state.archive)
  const unarchiveAction = useAccountsStore((state) => state.unarchive)
  const destroyAction = useAccountsStore((state) => state.destroy)

  const [searchParams, setSearchParams] = useSearchParams()

  const onSearchParamsChange = (params: URLSearchParamsInit) => setSearchParams(params)

  const create = useCallback(async (data: Create, success: () => void, failure: () => void) => {
    try {
      const res = createAction(data)

      toast.promise(res, {
        loading: "Creating...",
        success: (data) => {
          return `${data.name} created`
        },
        error: "Oops!. Something went wrong"
      })

      await res

      success()
    } catch (error) {
      failure()

      throw error
    }
  }, [createAction])

  const update = useCallback(async (data: Update, success: () => void, failure: () => void) => {
    try {
      const res = updateAction(data)

      toast.promise(res, {
        loading: "Updating...",
        success: (data) => {
          return `${data.name} updated`
        },
        error: "Oops!. Something went wrong"
      })

      await res

      success()
    } catch (error) {
      failure()

      throw error
    }
  }, [updateAction])

  const destroy = useCallback(async (id: number, success: () => void, failure: () => void) => {
    try {
      const res = destroyAction(id)

      toast.promise(res, {
        loading: "Deleting...",
        success: (data) => {
          return `${data.name} deleted`
        },
        error: "Oops!. Something went wrong"
      })

      await res

      success()
    } catch (error) {
      failure()

      throw error
    }
  }, [destroyAction])

  const archive = useCallback(async (id: number, success: () => void, failure: () => void) => {
    try {
      const res = archiveAction(id)

      toast.promise(res, {
        loading: "Archiving...",
        success: (data) => {
          return `${data.name} archived`
        },
        error: "Oops!. Something went wrong"
      })

      await res

      success()
    } catch (error) {
      failure()

      throw error
    }
  }, [archiveAction])

  const unarchive = useCallback(async (id: number, success: () => void, failure: () => void) => {
    try {
      const res = unarchiveAction(id)

      toast.promise(res, {
        loading: "Unarchiving...",
        success: (data) => {
          return `${data.name} unarchived`
        },
        error: "Oops!. Something went wrong"
      })

      await res

      success()
    } catch (error) {
      failure()

      throw error
    }
  }, [unarchiveAction])

  useEffect(() => { listQuery() }, [])

  return <Screen
    accounts={accounts}

    searchParams={searchParams}
    onSearchParamsChange={onSearchParamsChange}

    onCreateAccountAction={create}
    onUpdateAccountAction={update}
    onArchiveAccountAction={archive}
    onUnarchiveAccountAction={unarchive}
    onDeleteAccountAction={destroy}
  />
}