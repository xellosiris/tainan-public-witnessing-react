import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_overseerLayout/overview")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/overview"!</div>;
}
