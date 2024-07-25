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
                        element: <App.Account.Show />
                    },
                    {
                        path: "new",
                        loader: App.Account.loaders.new(Client),
                        element: <App.Account.New />
                    },
                ]
            },
            {
                path: "books",
                element: <App.Books />,
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