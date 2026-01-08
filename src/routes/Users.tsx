import { CONGS, USERS } from "@/assets/mock";
import { PERMISSIONS_OPTIONS } from "@/assets/permission";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/data-table/columns";
import type { User } from "@/types/user";

export type UserColsType = User & {
  congName: string;
  permissionName: string;
  genderName: string;
};

export default function Users() {
  // const { data: users } = useQuery({
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
