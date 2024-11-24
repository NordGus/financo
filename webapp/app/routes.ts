import {
  type RouteConfig,
  index,
  layout,
  route
} from "@react-router/dev/routes";

export default [
  layout("layout.tsx"),
  index("routes/login.tsx"),
  layout("authentication/layout.tsx", [
    route("login", "routes/login.tsx"),
  ])
] satisfies RouteConfig;
