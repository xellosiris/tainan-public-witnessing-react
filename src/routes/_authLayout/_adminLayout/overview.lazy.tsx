import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authLayout/_adminLayout/overview')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/overview"!</div>
}
