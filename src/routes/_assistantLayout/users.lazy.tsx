import { createLazyFileRoute } from "@tanstack/react-router";
import { CONGS, USERS } from "@/assets/mock";
import { PERMISSIONS_OPTIONS } from "@/assets/permission";
import { DataTable } from "@/components/data-table";
import { columns, type UserColsType } from "@/components/data-table/columns";

export const Route = createLazyFileRoute("/_assistantLayout/users")({
  component: Users,
});

function Users() {
  const UsersCols: UserColsType[] = USERS.map((user) => ({
    ...user,
    congName: CONGS.find((c) => c.id === user.congId)?.name ?? "未知會眾",
    permissionName:
      PERMISSIONS_OPTIONS.find((p) => p.id === user.permission.toString())
        ?.name ?? "未知權限",
    genderName: user.gender === "male" ? "男" : "女",
  }));
  return (
    <div className="max-w-4xl">
      <DataTable columns={columns} data={UsersCols} />
    </div>
  );
}
