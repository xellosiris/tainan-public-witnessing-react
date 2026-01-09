import { CONGS, USERS } from "@/assets/mock";
import { PERMISSIONS_OPTIONS } from "@/assets/permission";
import { DataTable } from "@/components/data-table";
import { columns, type UserColsType } from "@/components/data-table/columns";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authLayout/_adminLayout/users")({
  component: Users,
});

function Users() {
  // const { data: users } = useSuspenseQuery({
  //   queryKey: ["users"],
  //   queryFn: getUsers,
  // });

  const UsersCols: UserColsType[] = USERS.map((user) => ({
    ...user,
    congName: CONGS.find((c) => c.id === user.congId)!.name,
    permissionName: PERMISSIONS_OPTIONS.find((p) => p.id === user.permission.toString())!.name,
    genderName: user.gender === "male" ? "男" : "女",
  }));
  return (
    <div className="max-w-4xl">
      <DataTable columns={columns} data={UsersCols} />
    </div>
  );
}
