import { toast } from "sonner";
import { archiveCategory } from "~/modules/categories/api/commands/archive-account";
import { deleteCategory } from "~/modules/categories/api/commands/delete-account";
import { unarchiveCategory } from "~/modules/categories/api/commands/unarchive-account";
import { Intents } from "~/modules/categories/types/actions";
import { Route } from "./+types/show";

interface ActionRequestBody {
  intent: Intents["archive"] | Intents["unarchive"] | Intents["delete"]
}

export async function clientAction({ request, params }: Route.ClientActionArgs) {
  const id = Number(params.id)
  const values: ActionRequestBody = await request.json()

  const actions = {
    archive: async () => {
      try {
        const response = archiveCategory(id)

        toast.promise(response, {
          loading: "Archiving...",
          success: (data) => {
            return `${data.name} archived`
          },
          error: "Oops!. Something went wrong"
        })

        const archived = await response

        return archived
      } catch (error) {
        if (error instanceof Response && error.status === 401) throw error

        console.error(error)

        return null
      }
    },
    unarchive: async () => {
      try {
        const response = unarchiveCategory(id)

        toast.promise(response, {
          loading: "Unarchiving...",
          success: (data) => {
            return `${data.name} unarchived`
          },
          error: "Oops!. Something went wrong"
        })

        const unarchived = await response

        return unarchived
      } catch (error) {
        if (error instanceof Response && error.status === 401) throw error

        console.error(error)

        return null
      }
    },
    delete: async () => {
      try {
        const response = deleteCategory(id)

        toast.promise(response, {
          loading: "Deleting...",
          success: (data) => {
            return `${data.name} deleted`
          },
          error: "Oops!. Something went wrong"
        })

        const deleted = await response

        return deleted
      } catch (error) {
        if (error instanceof Response && error.status === 401) throw error

        console.error(error)

        return null
      }
    },
  }

  const action = actions[values.intent]

  if (!action) throw new Error("invalid action")

  return await action()
}
