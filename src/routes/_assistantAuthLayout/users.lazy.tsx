import DeleteDialog from "@/components/dialog/DeleteDialog";
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
import { deleteUser, getUser } from "@/services/user";
import type { User } from "@/types/user";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createLazyFileRoute("/_assistantAuthLayout/users")({
  component: Users,
});

function Users() {
  const [userId, setUserId] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const queryClient = useQueryClient();
  const results = useQueries({
    queries: [
      {
        queryKey: ["setting"],
        queryFn: getSetting,
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
      user: results[1].data,
      schedule: results[2].data,

      isInitialLoading: results[0].isLoading,
      isUserLoading: results[1].isLoading || results[2].isLoading,
    }),
  });

  const { user, schedule, setting, isInitialLoading, isUserLoading } = results;
  const onClose = () => {
    setOpenDel(false);
  };

  const mutation = useMutation({
    mutationFn: (userId: User["id"]) => deleteUser(userId),
    onSuccess: () => {
      toast.success("刪除成功");
      queryClient.invalidateQueries({ queryKey: ["setting"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
    onError: () => toast.error("刪除失敗"),
    onSettled: onClose,
  });
  const onDelete = (userId: User["id"]) => {
    mutation.mutate(userId);
    setUserId("");
  };
  if (isInitialLoading) return <Loading />;
  if (!setting) return <ErrorComponent />;

  const { userKeys, congs } = setting;
  return (
    <div className="max-w-4xl space-y-4">
      {mutation.isPending && <Loading />}
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
      {user && schedule && congs && (
        <>
          <Tabs defaultValue="user">
            <div className="flex flex-wrap gap-2">
              <TabsList>
                <TabsTrigger value="user" disabled={!userId}>
                  基本資料
                </TabsTrigger>
                <TabsTrigger value="schedule" disabled={!userId}>
                  排班設定
                </TabsTrigger>
              </TabsList>
              <Button onClick={() => setOpenDel(true)}>刪除人員</Button>
            </div>
            <TabsContent value="user">
              <UserForm key={user.id} editUserObj={user} congs={congs} />
            </TabsContent>
            <TabsContent value="schedule">
              <ScheduleForm key={user.id} editScheduleObj={schedule} setting={setting} />
            </TabsContent>
          </Tabs>
          {openDel && (
            <DeleteDialog
              title="刪除成員"
              description={`你確定要刪除${user.displayName}嗎？`}
              confirmText={user.displayName}
              onClose={onClose}
              deleteFn={() => onDelete(userId)}
            />
          )}
        </>
      )}
    </div>
  );
}
