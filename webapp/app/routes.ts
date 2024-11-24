import {
  type RouteConfig,
  index,
  layout,
  route
} from "@react-router/dev/routes";

export default [
  layout("shared/layout.tsx", [
    index("routes/dashboard.tsx"),
    route("/accounts", "routes/accounts/index.tsx")
  ]),
  layout("authentication/layout.tsx", [
    route("login", "routes/login.tsx"),
  ])
] satisfies RouteConfig;
