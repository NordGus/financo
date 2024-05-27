import { createBrowserRouter } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";

import App from "./routes/App";
import Root from './routes/app/Root';
import AccountsAndGoals from './routes/app/AccountsAndGoals';
import Books from './routes/app/Books';

import ErrorPage from './routes/ErrorPage';

const router = (_queryClient: QueryClient) => createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Root />
            },
            {
                path: "accounts",
                element: <AccountsAndGoals />
            },
            {
                path: "books",
                element: <Books />
            }
        ]
    }
])

export default router