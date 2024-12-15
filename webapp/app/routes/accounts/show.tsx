import { redirect } from "react-router";
import { toast } from "sonner";
import { archiveAccount } from "~/modules/accounts/api/commands/archive-account";
import { deleteAccount } from "~/modules/accounts/api/commands/delete-account";
import { unarchiveAccount } from "~/modules/accounts/api/commands/unarchive-account";
import { Create } from "~/modules/accounts/types/create";
import { Route } from "./+types/show";

interface ActionRequestBody extends Create {
  intent: "archive" | "unarchive" | "delete"
}

export async function clientAction({ request, params }: Route.ClientActionArgs) {
  const id = Number(params.id)
  const values: ActionRequestBody = await request.json()

  console.log(values.intent)

  const actions = {
    archive: async () => {
      try {
        const response = archiveAccount(id)

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
        const response = unarchiveAccount(id)

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
        const response = deleteAccount(id)

        toast.promise(response, {
          loading: "Deleting...",
          success: (data) => {
            return `${data.name} deleted`
          },
          error: "Oops!. Something went wrong"
        })

        await response

        return redirect("/accounts")
      } catch (error) {
        if (error instanceof Response && error.status === 401) throw error

        console.error(error)

        return null
      }
    }
  }

  const action = actions[values.intent]

  if (!action) throw new Error("invalid action")

  return await action()
}
