import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  SortAscIcon,
  SortDescIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@/types/user";

export type UserColsType = User & {
  congName: string;
  permissionName: string;
  genderName: string;
};

export const columns: ColumnDef<UserColsType>[] = [
  {
    accessorKey: "active",
    header: "啟用",
    cell: ({ row }) => <Checkbox checked={row.original.active} />,
    size: 50,
  },
  {
    accessorKey: "displayName",
    header: ({ column }) => {
      return (
        <div className="flex items-center">
          <span>使用者名稱</span>
          <Button
            variant="ghost"
            size={"icon-sm"}
            onClick={() => column.toggleSorting()}
          >
            {!column.getIsSorted() && <ArrowUpDown className="size-4" />}
            {column.getIsSorted() === "desc" && (
              <SortDescIcon className="size-4 text-destructive" />
            )}
            {column.getIsSorted() === "asc" && (
              <SortAscIcon className="size-4 text-destructive" />
            )}
          </Button>
        </div>
      );
    },
    size: 150,
  },
  {
    accessorKey: "genderName",
    header: "性別",
    size: 30,
  },
  {
    accessorKey: "congName",
    header: "會眾",
    size: 150,
  },
  {
    accessorKey: "cellphone",
    header: "手機號碼",
  },
  {
    accessorKey: "telephone",
    header: "市話",
  },
  {
    accessorKey: "permissionName",
    header: "權限",
    size: 50,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/users/$userId" params={{ userId: user.id }}>
                編輯
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">刪除</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 20,
  },
];
