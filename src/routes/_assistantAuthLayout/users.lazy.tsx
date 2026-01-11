import ScheduleForm from "@/components/form/ScheduleForm";
import UserForm from "@/components/form/UserForm";
import ErrorComponent from "@/components/route/ErrorComponent";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Loading } from "@/components/ui/loading";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { getSchedule } from "@/services/schedule";
import { getSetting } from "@/services/setting";
import { getSiteShifts } from "@/services/siteShift";
import { getUser } from "@/services/user";
import { useQueries } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

export const Route = createLazyFileRoute("/_assistantAuthLayout/users")({
  component: Users,
});

function Users() {
  const [userId, setUserId] = useState<string>("");
  const [open, setOpen] = useState(false);
  const results = useQueries({
    queries: [
      {
        queryKey: ["setting"],
        queryFn: getSetting,
      },
      {
        queryKey: ["siteShifts"],
        queryFn: getSiteShifts,
      },
      {
        queryKey: ["users", userId],
        queryFn: () => getUser(userId),
        enabled: !!userId,
      },
      {
        queryKey: ["schedule", userId],
        queryFn: () => getSchedule(userId),
        enabled: !!userId,
      },
    ],
    combine: (results) => ({
      setting: results[0].data,
      siteShifts: results[1].data,
      user: results[2].data,
      schedule: results[3].data,

      isInitialLoading: results[0].isLoading || results[1].isLoading,
      isUserLoading: results[2].isLoading || results[3].isLoading,
    }),
  });

  const { user, siteShifts, schedule, setting, isInitialLoading, isUserLoading } = results;
  if (isInitialLoading) return <Loading />;
  if (!setting) return <ErrorComponent />;

  const { userKeys, congs } = setting;
  console.log({ user, schedule, congs, siteShifts });
  return (
    <div className="max-w-4xl space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between w-50 text-muted-foreground"
          >
            {userId ? userKeys.find((user) => user.id === userId)?.displayName : "選擇一位使用者"}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-50">
          <Command
            filter={(value, search) => {
              const name = userKeys.find((u) => u.id === value)?.displayName;
              if (name?.includes(search)) return 1;
              return 0;
            }}
          >
            <CommandInput placeholder="輸入使用者..." className="h-9" />
            <CommandEmpty>找不到使用者</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {userKeys.map((user) => (
                  <CommandItem
                    key={user.id}
                    value={user.id}
                    onSelect={(currentValue) => {
                      setUserId(currentValue);
                      setOpen(false);
                    }}
                  >
                    {user.displayName}
                    <Check className={cn("ml-auto", userId === user.id ? "opacity-100" : "opacity-0")} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {isUserLoading && <Loading />}
      {user && schedule && congs && siteShifts && (
        <Tabs defaultValue="user">
          <TabsList>
            <TabsTrigger value="user" disabled={!userId}>
              基本資料
            </TabsTrigger>
            <TabsTrigger value="schedule" disabled={!userId}>
              排班設定
            </TabsTrigger>
          </TabsList>
          <TabsContent value="user" className="max-w-3xl">
            <UserForm key={user.id} editUserObj={user} congs={congs} />
          </TabsContent>
          <TabsContent value="schedule" className="max-w-3xl">
            <ScheduleForm key={user.id} editScheduleObj={schedule} siteShifts={siteShifts} setting={setting} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
