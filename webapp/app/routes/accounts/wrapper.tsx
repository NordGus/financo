import { Outlet } from "react-router";
import { Route } from "./+types/wrapper";

export async function clientLoader({ }: Route.ClientLoaderArgs) {
  return {
    breadcrumb: "Accounts",
  }
}

export default function Wrapper() {
  return <Outlet />
}