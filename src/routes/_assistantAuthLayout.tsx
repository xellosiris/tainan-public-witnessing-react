import { user } from "@/App";
import { PERMISSION } from "@/assets/permission";
import ErrorComponent from "@/components/route/ErrorComponent";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_assistantAuthLayout")({
  component: () => {
    const { permission } = user;
    if (permission <= PERMISSION.Assistant) return <RouteComponent />;
    return <ErrorComponent warningText="你沒有權限進入此頁面，請聯繫管理員" />;
  },
});

function RouteComponent() {
  return <Outlet />;
}
