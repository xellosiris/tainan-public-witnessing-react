import { queryClient, user } from "@/App";
import { PERMISSION } from "@/assets/permission";
import ErrorComponent from "@/components/route/ErrorComponent";
import NotFoundedComponent from "@/components/route/NotFoundedComponent";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";
import { getSetting } from "@/services/setting";
import { useQuery } from "@tanstack/react-query";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { MenuIcon } from "lucide-react";
import { useState } from "react";

const MenuItem = ({ to, label, linkPermission }: { to: string; label: string; linkPermission: number }) => {
  const { permission } = user;
  return permission <= linkPermission && <Link to={to}>{label}</Link>;
};

export const Route = createRootRoute({
  component: Layout,
  errorComponent: ErrorComponent,
  notFoundComponent: NotFoundedComponent,
  loader: async () => {
    await queryClient.ensureQueryData({
      queryKey: ["setting"],
      queryFn: getSetting,
    });
  },
});

export default function Layout() {
  const { displayName, permission } = user;
  const [open, setOpen] = useState<boolean>(false);
  const { data: setting } = useQuery({
    queryKey: ["setting"],
    queryFn: getSetting,
  });

  return (
    <>
      <header
        className={
          "relative z-50 flex items-center h-12 gap-2 px-2 text-base text-white lg:text-xl bg-primary justify-between"
        }
      >
        <div className="flex items-center gap-1">
          <Button
            className="hover:text-secondary hover:bg-transparent"
            onClick={() => setOpen(true)}
            variant="ghost"
            size={"icon"}
          >
            <MenuIcon className="size-5" />
          </Button>
          {setting?.name} {import.meta.env.DEV && "(開發模式)"}
        </div>
        {displayName}
      </header>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-70 data-[state=closed]:duration-200 data-[state=open]:duration-300 top-12 h-[calc(100dvh-3rem)] border-t-0 flex flex-col"
        >
          <SheetHeader>
            <SheetTitle>選單</SheetTitle>
          </SheetHeader>
          <nav className="flex-1 py-4 overflow-y-auto" onClick={() => setOpen(false)}>
            <div className="px-4 grid gap-3">
              {permission <= PERMISSION.Publisher && <label className="text-sm text-muted-foreground">一般功能</label>}
              <div className="flex flex-col ml-4 gap-3">
                <MenuItem to="/" label="首頁" linkPermission={3} />
                <MenuItem to="/myShifts" label="我的班表" linkPermission={3} />
                <MenuItem to="/mySchedule" label="我的排班設定" linkPermission={3} />
                <MenuItem to="/vacantShifts" label="報名空缺" linkPermission={3} />
              </div>
              {permission <= PERMISSION.Assistant && (
                <>
                  <Separator className="my-2" />
                  <label className="text-sm text-muted-foreground">管理功能</label>
                </>
              )}
              <div className="flex flex-col ml-4 gap-3">
                <MenuItem to="/overview" label="狀態一覽" linkPermission={1} />
                <MenuItem to="/users" label="成員管理" linkPermission={2} />
                <MenuItem to="/shifts" label="班次管理" linkPermission={2} />
                <MenuItem to="/sites" label="展示地點管理" linkPermission={1} />
                <MenuItem to="/setting" label="系統設定" linkPermission={1} />
              </div>
            </div>
          </nav>

          <SheetFooter className="pt-4 mt-auto border-t">
            <Button type="button" className="w-full">
              登出
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <main className="p-4">
        <Outlet />
        <Toaster />
      </main>
    </>
  );
}
