import { useEffect } from "react";
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useNavigate,
} from "react-router";
import { z } from "zod";
import { zodErrorMap } from "~/config/zod-custom-error-map";
import { Button } from "~/modules/shared/components/ui/button";
import { Heading1 } from "~/modules/shared/components/ui/headings";
import { TooltipProvider } from "~/modules/shared/components/ui/tooltip";
import useDetectColorScheme from "~/modules/shared/hooks/use-detect-color-scheme";
import type { Route } from "./+types/root";
import "./app.css";
import { useCurrenciesStore } from "./modules/currencies/stores/currencies";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export async function clientLoader({ }: Route.LoaderArgs) {
  return {
    breadcrumb: "financo"
  }
}

export function Layout({ children }: { children: React.ReactNode }) {
  const scheme = useDetectColorScheme()

  return (
    <html lang="en" className={scheme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const listCurrenciesQuery = useCurrenciesStore((state) => state.list)

  useEffect(() => {
    z.setErrorMap(zodErrorMap)

    listCurrenciesQuery()
  }, [])

  return (
    <TooltipProvider>
      <Outlet />
    </TooltipProvider>
  );
}

type ErrorBoundaryActionType = "not_found" | "error"

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const navigate = useNavigate();

  let message = "Oops!";
  let details = "An unexpected error occurred";
  let stack: string | undefined;
  let action: ErrorBoundaryActionType = "error";

  if (isRouteErrorResponse(error)) {
    if (error.status === 401) redirect("/login");
    else if (error.status === 404) {
      message = "Not found";
      details = "The requested page could not be found";
      action = "not_found";
    } else {
      message = "Error";
      details = error.statusText || details;
      action = "error";
    }
  } else if (error instanceof Response) {
    if (error.status === 401) return redirect("/login");
    else if (error.status === 404) {
      message = "Not found";
      details = "The requested resource could not be found";
      action = "not_found";
    } else {
      message = "API error";
      details = error.statusText || details;
      action = "error";
    }
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-20 p-16">
      <Heading1>{message}</Heading1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
      {
        {
          not_found: (
            <Button asChild className="mt-4">
              <Link to="/">Return to your Morning brew</Link>
            </Button>
          ),
          error: (
            <Button className="mt-4" onClick={() => navigate(0)}>
              Try again
            </Button>
          )
        }[action]
      }
    </main>
  );
}
