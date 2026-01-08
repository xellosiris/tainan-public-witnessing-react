import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, SortAscIcon, SortDescIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserColsType } from "@/routes/Users";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "../ui/checkbox";

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
          <Button variant="ghost" size={"icon-sm"} onClick={() => column.toggleSorting()}>
            {!column.getIsSorted() && <ArrowUpDown className="size-4" />}
            {column.getIsSorted() === "desc" && <SortDescIcon className="size-4 text-destructive" />}
            {column.getIsSorted() === "asc" && <SortAscIcon className="size-4 text-destructive" />}
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
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>Copy payment ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 20,
  },
];
