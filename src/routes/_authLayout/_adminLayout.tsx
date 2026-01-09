import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authLayout/_adminLayout")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
