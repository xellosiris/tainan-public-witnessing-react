import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_publisherLayout")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
