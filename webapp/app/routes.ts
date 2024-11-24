import {
  type RouteConfig,
  layout,
  route
} from "@react-router/dev/routes";

export default [
  layout("shared/layout.tsx", [
    route("/dashboard", "routes/dashboard.tsx"),
    route("/accounts", "routes/accounts/index.tsx")
  ]),
  layout("authentication/layout.tsx", [
    route("login", "routes/login.tsx"),
  ])
] satisfies RouteConfig;
