import { isRouteErrorResponse, Link, Outlet, redirect, useNavigate } from "react-router";
import { Button } from "~/modules/shared/components/ui/button";
import { Heading1 } from "~/modules/shared/components/ui/headings";
import { Route } from "../+types/root";

type ErrorBoundaryActionType = "not_found" | "error"

export default function Wrapper({ }) {
  return <Outlet />
}

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
    <section className="pt-20 p-16">
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
    </section>
  );
}