import { createBrowserRouter } from "react-router-dom";

import Client from "@queries/Client";

import App from "@routes/App";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App.Layout />,
        errorElement: <App.ErrorBoundary />,
        children: [
            {
                index: true,
                element: <App.Dashboard />
            },
            {
                path: "accounts",
                loader: App.Account.loaders.main(Client),
                element: <App.Account.Layout />,
                children: [
                    {
                        index: true,
                        loader: App.Account.loaders.accounts(Client),
                        element: <App.Account.Index />
                    },
                    {
                        path: ":id",
                        loader: App.Account.loaders.account(Client),
                        action: App.Account.actions.account(Client),
                        element: <App.Account.Show />
                    },
                ]
            },
            {
                path: "ledger",
                element: <App.Ledger />,
                children: [
                    {
                        path: "transactions/:id",
                        element: <App.Transaction.Show />
                    },
                    {
                        path: "transactions/new",
                        element: <App.Transaction.New />
                    },
                ]
            },
            {
                path: '*',
                element: <App.NotFound />
            }
        ]
    }
])

export default router