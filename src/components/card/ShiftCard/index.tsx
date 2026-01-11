import { user } from "@/App";
import { PERMISSION } from "@/assets/permission";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { getSetting } from "@/services/setting";
import { deleteShift, signupShift } from "@/services/shift";
import type { Shift } from "@/types/shift";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ClipboardEditIcon, Clock, MapPin, PlusCircle } from "lucide-react";
import React, { Suspense, useState } from "react";
import { toast } from "sonner";
import ReportDialog from "../../dialog/ReportDialog";
import ShiftCardAction from "./ShiftCardAction";
import UserTag from "./UserTag";

const ShiftDialog = React.lazy(() => import("../../dialog/ShiftDialog"));

type Props = {
  shift: Shift;
};

export default function ShiftCard({ shift }: Props) {
  const queryClient = useQueryClient();
  const { id: userId, permission } = user;
  const [openReport, setOpenReport] = useState<boolean>(false);
  const [editObj, setEditObj] = useState<null | undefined | Shift>(undefined);

  const { data: setting } = useSuspenseQuery({
    queryKey: ["setting"],
    queryFn: getSetting,
  });

  const onEditShift = (shift: Shift) => {
    setEditObj(shift);
  };
  const signupMutation = useMutation({
    mutationFn: () => signupShift(shift.id, userId),
    onSuccess: () => {
      toast.success("報名成功", {
        description: "請到《我的班表》中再次確認",
      });
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
    onError: (error) => {
      if (error instanceof Error && error.message === "SHIFT_TAKEN") {
        toast.error("報名失敗", {
          description: "很抱歉剛剛已經有人報名",
        });
      } else {
        toast.error("報名失敗");
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (shift: Shift) => deleteShift(shift.id),
    onSuccess: () => {
      toast.success("刪除班次成功");
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
    onError: () => toast.error("刪除失敗"),
  });

  const { userKeys, siteKeys } = setting;

  return (
    <>
      {signupMutation.isPending && <Loading />}
      <Card className="relative w-full max-w-xs gap-4">
        {permission <= PERMISSION.Assistant && (
          <ShiftCardAction shift={shift} onEdit={onEditShift} onDelete={deleteMutation.mutate} />
        )}
        <CardHeader className="gap-1">
          <CardTitle className="flex items-center text-2xl">
            <span>{shift.date}</span>
            <span className="text-sm font-normal text-muted-foreground">（{dayjs(shift.date).format("dd")}）</span>
          </CardTitle>
          <CardTitle className="flex items-center gap-1 text-base">
            <MapPin className="size-4" />
            {siteKeys.find((s) => s.id === shift.siteId)?.name}
          </CardTitle>
          <CardTitle className="flex items-center gap-1 text-base">
            <Clock className="size-4" />
            {shift.startTime} ～ {shift.endTime}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 min-h-14">
          {shift.attendees.map((attendee, index) => (
            <UserTag
              index={index}
              attendee={attendee}
              userKeys={userKeys}
              requiredDeliverers={shift.requiredDeliverers}
            />
          ))}
        </CardContent>
        <CardFooter className="flex justify-end gap-1">
          <Button
            onClick={() => setOpenReport(true)}
            disabled={dayjs(`${shift.date} ${shift.endTime}`).isAfter(dayjs().subtract(5, "minutes"))}
            //班次結束前5分鐘可以回報
            variant={"ghost"}
            size={"icon"}
          >
            <ClipboardEditIcon className="size-6" />
          </Button>
          {!shift.isFull && !shift.attendees.includes(userId) && (
            <Button onClick={() => signupMutation.mutate()} variant="ghost" size="icon">
              <PlusCircle className="size-6" />
            </Button>
          )}
        </CardFooter>
      </Card>
      <Suspense fallback={<Loading />}>
        {editObj !== undefined && <ShiftDialog editShiftObj={editObj} onClose={() => setEditObj(undefined)} />}
      </Suspense>
      {openReport && <ReportDialog onClose={() => setOpenReport(false)} shift={shift} />}
    </>
  );
}
