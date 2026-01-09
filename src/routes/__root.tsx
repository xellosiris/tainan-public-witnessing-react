import MenuItem from "@/components/MenuItem";
import Error from "@/components/route/ErrorComponent";
import NotFoundedComponent from "@/components/route/NotFoundedComponent";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { createRootRoute, Outlet } from "@tanstack/react-router";
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
  const onItemClick = () => {
    setOpen(false);
  };
  return (
    <Fragment>
      <header className={"relative z-50 flex items-center h-12 gap-2 px-2 text-base text-white lg:text-xl bg-primary"}>
        <Button
          className="hover:text-secondary hover:bg-transparent"
          onClick={() => setOpen(true)}
          variant="ghost"
          size={"icon"}
        >
          <MenuIcon className="size-5" />
        </Button>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent
            side="left"
            className="w-70 data-[state=closed]:duration-200 data-[state=open]:duration-300 top-12 h-[calc(100vh-3rem)] border-t-0 flex flex-col"
          >
            <SheetHeader>
              <SheetTitle>選單</SheetTitle>
            </SheetHeader>
            <nav className="flex-1 py-4 overflow-y-auto">
              <div className="px-4 grid gap-3">
                <label className="text-sm text-muted-foreground">一般功能</label>
                <MenuItem url="/" label="首頁" onClick={onItemClick} />
                <MenuItem url="/myShifts" label="我的班次" onClick={onItemClick} />
                <MenuItem url="/mySchedule" label="我的排班" onClick={onItemClick} />
                <MenuItem url="/vacantShifts" label="報名空缺" onClick={onItemClick} />
                <Separator className="my-2" />
                <label className="text-sm text-muted-foreground">管理功能</label>
                <MenuItem url="/overview" label="狀態一覽" onClick={onItemClick} />
                <MenuItem url="/users" label="成員管理" onClick={onItemClick} />
                <MenuItem url="/shifts" label="班次管理" onClick={onItemClick} />
                <MenuItem url="/sites" label="地點管理" onClick={onItemClick} />
                <MenuItem url="/setting" label="基本設定" onClick={onItemClick} />
              </div>
            </nav>

            <SheetFooter className="pt-4 mt-auto border-t">
              <Button type="button" className="w-full">
                登出
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        台南都市公眾場所見證 {import.meta.env.DEV && "(開發模式)"}
        <div className="flex-auto" />
        XXXX
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </Fragment>
  );
}
