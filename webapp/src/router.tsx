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
                loader: App.Accounts.loaders.main(Client),
                element: <App.Accounts.Layout />,
                children: [
                    {
                        index: true,
                        loader: App.Accounts.loaders.accounts(Client),
                        element: <App.Accounts.Index />
                    },
                    {
                        path: ":id",
                        loader: App.Accounts.loaders.account(Client),
                        action: App.Accounts.actions.account(Client),
                        element: <App.Accounts.Show />
                    },
                ]
            },
            {
                path: "ledger",
                loader: App.Ledger.loaders.main(Client),
                element: <App.Ledger.Layout />,
                children: [
                    {
                        index: true,
                        loader: App.Ledger.loaders.transactions(Client),
                        element: <App.Ledger.Index />
                    },
                    {
                        path: ":id",
                        action: App.Ledger.actions.transaction(Client),
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