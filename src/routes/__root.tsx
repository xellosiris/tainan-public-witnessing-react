import { default as Error } from "@/components/route/ErrorComponent";
import NotFoundedComponent from "@/components/route/NotFoundedComponent";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";
import { getSetting } from "@/services/setting";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import { Fragment } from "react/jsx-runtime";

export const Route = createRootRoute({
  component: Layout,
  errorComponent: Error,
  notFoundComponent: NotFoundedComponent,
});

export default function Layout() {
  const [open, setOpen] = useState<boolean>(false);
  const { data: setting } = useSuspenseQuery({
    queryKey: ["setting"],
    queryFn: getSetting,
  });

  return (
    <Fragment>
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
          {setting.name} {import.meta.env.DEV && "(開發模式)"}
        </div>
        XXXX
      </header>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-70 data-[state=closed]:duration-200 data-[state=open]:duration-300 top-12 h-[calc(100vh-3rem)] border-t-0 flex flex-col"
        >
          <SheetHeader>
            <SheetTitle>選單</SheetTitle>
          </SheetHeader>
          <nav className="flex-1 py-4 overflow-y-auto" onClick={() => setOpen(false)}>
            <div className="px-4 grid gap-3">
              <label className="text-sm text-muted-foreground">一般功能</label>
              <div className="flex flex-col ml-4 gap-3">
                <Link to="/">首頁</Link>
                <Link to="/myShifts">我的班表</Link>
                <Link to="/mySchedule">我的排班設定</Link>
                <Link to="/vacantShifts">報名空缺</Link>
              </div>
              <Separator className="my-2" />
              <label className="text-sm text-muted-foreground">管理功能</label>
              <div className="flex flex-col ml-4 gap-3">
                <Link to="/overview">狀態一覽</Link>
                <Link to="/users">成員管理</Link>
                <Link to="/shifts">班次管理</Link>
                <Link to="/sites">地點管理</Link>
                <Link to="/setting">系統設定</Link>
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
    </Fragment>
  );
}
