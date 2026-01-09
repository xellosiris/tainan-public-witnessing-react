import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authLayout/_adminLayout/setting")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authLayout/_adminLayout/setting"!</div>;
}
