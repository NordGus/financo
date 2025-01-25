import { useCallback, useEffect } from "react";
import { URLSearchParamsInit, useSearchParams } from "react-router";
import { toast } from "sonner";
import { Screen } from "~/modules/categories/screens";
import { useCategoriesStore } from "~/modules/categories/stores/categories";
import { Create, CreateChild } from "~/modules/categories/types/create";
import { Update, UpdateChild } from "~/modules/categories/types/update";
import { Route } from "./+types/index";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "financo - Categories" },
    { name: "description", content: "Manage your Ledger Categories" }
  ]
}

export async function clientLoader({ }: Route.ClientLoaderArgs) {
  return { breadcrumb: "Categories" }
}

export default function CategoriesRoute() {
  const categories = useCategoriesStore((state) => state.categories)

  const listQuery = useCategoriesStore((state) => state.list)

  const createAction = useCategoriesStore((state) => state.create)
  const updateAction = useCategoriesStore((state) => state.update)
  const archiveAction = useCategoriesStore((state) => state.archive)
  const unarchiveAction = useCategoriesStore((state) => state.unarchive)
  const destroyAction = useCategoriesStore((state) => state.destroy)

  const createChildAction = useCategoriesStore((state) => state.createChild)
  const updateChildAction = useCategoriesStore((state) => state.updateChild)
  const destroyChildAction = useCategoriesStore((state) => state.destroyChild)

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

  const createChild = useCallback(
    async (parentId: number, data: CreateChild, success: () => void, failure: () => void) => {
      try {
        const res = createChildAction(parentId, data)

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
    },
    [createChildAction]
  )

  const updateChild = useCallback(
    async (data: UpdateChild, success: () => void, failure: () => void) => {
      try {
        const res = updateChildAction(data)

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
    },
    [updateChildAction]
  )

  const destroyChild = useCallback(
    async (parentId: number, id: number, success: () => void, failure: () => void) => {
      try {
        const res = destroyChildAction(parentId, id)

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
    },
    [destroyChildAction]
  )

  useEffect(() => {
    listQuery()
  }, [])

  return <Screen
    categories={categories}

    searchParams={searchParams}
    onSearchParamsChange={onSearchParamsChange}

    onCreateAction={create}
    onUpdateAction={update}
    onDeleteAction={destroy}
    onArchiveAction={archive}
    onUnarchiveAction={unarchive}

    onCreateChildAction={createChild}
    onUpdateChildAction={updateChild}
    onDeleteChildAction={destroyChild}
  />
}
