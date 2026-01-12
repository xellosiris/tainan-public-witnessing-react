import UsersCombobox from "@/components/Combobox/UsersCombobox";
import DeleteDialog from "@/components/dialog/DeleteDialog";
import ScheduleForm from "@/components/form/ScheduleForm";
import UserForm from "@/components/form/UserForm";
import ErrorComponent from "@/components/route/ErrorComponent";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSchedule } from "@/services/schedule";
import { getSetting } from "@/services/setting";
import { deleteUser, getUser } from "@/services/user";
import type { User } from "@/types/user";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import { AlertTriangleIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createLazyFileRoute("/_assistantAuthLayout/users")({
  component: Users,
});

function Users() {
  const [userId, setUserId] = useState<string>("");
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

  const { congs } = setting;
  return (
    <div className="max-w-4xl space-y-4">
      {mutation.isPending && <Loading />}
      <div className="w-50">
        <UsersCombobox value={userId} onSelect={setUserId} />
      </div>
      {isUserLoading && <Loading />}
      {user && schedule && congs && (
        <>
          {user.expiredAt && (
            <Alert variant={"destructive"}>
              <AlertTriangleIcon />
              <AlertTitle>請留意</AlertTitle>
              <AlertDescription>
                若沒有啟用，該使用者即將在{dayjs(user.expiredAt).format("YYYY年MM月DD日")}自動刪除
              </AlertDescription>
            </Alert>
          )}
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
              <ScheduleForm key={user.id} editScheduleObj={schedule} setting={setting} userId={user.id} />
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
