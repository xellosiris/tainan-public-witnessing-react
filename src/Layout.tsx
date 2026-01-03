import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import clsx from "clsx";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router";
import { Fragment } from "react/jsx-runtime";
import MenuItem from "./components/MenuItem";
import { Separator } from "./components/ui/separator";

export default function Layout() {
  const [open, setOpen] = useState<boolean>(false);
  const onItemClick = () => {
    setOpen(false);
  };
  return (
    <Fragment>
      <header
        className={clsx(
          "relative z-50 flex items-center h-12 gap-2 px-2 text-base text-white lg:text-xl",
          import.meta.env.DEV ? "bg-destructive" : "bg-primary"
        )}
      >
        <Button onClick={() => setOpen(true)} variant="ghost" size={"icon"}>
          <MenuIcon color="white" className="size-6" />
        </Button>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent
            side="left"
            className="w-[300px] data-[state=closed]:duration-200 data-[state=open]:duration-300 top-12 h-[calc(100vh-3rem)] border-t-0 flex flex-col"
          >
            <SheetHeader>
              <SheetTitle>選單</SheetTitle>
            </SheetHeader>

            <nav className="flex-1 py-4 overflow-y-auto">
              <div className="grid gap-3 px-4">
                <label className="text-sm text-muted-foreground">一般功能</label>
                <MenuItem url="/" label="首頁" onClick={onItemClick} />
                <MenuItem url="/profile" label="我的檔案" onClick={onItemClick} />
                <MenuItem url="/myShifts" label="我的排班" onClick={onItemClick} />
                <MenuItem url="/vacant_shifts" label="空缺排班" onClick={onItemClick} />
                <Separator className="my-2" />
                <label className="text-sm text-muted-foreground">管理功能</label>
                <MenuItem url="/overview" label="狀態一覽" onClick={onItemClick} />
                <MenuItem url="/members" label="成員管理" onClick={onItemClick} />
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
        台南都市公眾場所見證{import.meta.env.DEV && "（開發模式）"}
        <div className="flex-auto" />
        XXXX
      </header>

      <main className="p-4">
        <Outlet />
      </main>
    </Fragment>
  );
}
