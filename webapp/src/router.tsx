import { createBrowserRouter } from "react-router-dom";

import App from "./routes/App";
import Welcome from './routes/app/Welcome';
import AccountsAndGoals from './routes/app/AccountsAndGoals';
import Books from './routes/app/Books';

import ErrorPage from './routes/ErrorPage';

export default createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Welcome />
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