import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loading } from "@/components/ui/loading";
import { getSetting } from "@/services/setting";
import { signupShift } from "@/services/shift";
import type { Shift } from "@/types/shift";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  ClipboardEditIcon,
  Clock,
  EditIcon,
  MapPin,
  MoreVertical,
  PlusCircle,
  Trash2Icon,
  VanIcon,
} from "lucide-react";
import React, { Suspense, useState } from "react";
import ReportDialog from "../dialog/ReportDialog";
const ShiftDialog = React.lazy(() => import("../dialog/ShiftDialog"));

type Props = {
  shift: Shift;
};

export default function ShiftCard({ shift }: Props) {
  const [openReport, setOpenReport] = useState<boolean>(false);
  const [editObj, setEditObj] = useState<null | undefined | Shift>(undefined);
  const { data: setting } = useSuspenseQuery({
    queryKey: ["setting"],
    queryFn: getSetting,
  });
  const signupMutation = useMutation({
    mutationFn: () => signupShift(shift.id, "wef"),
  });

  const { userKeys, siteKeys } = setting;

  return (
    <React.Fragment>
      <Card className="relative w-full max-w-xs gap-4">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size={"icon"} className="absolute top-2 right-2">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditObj(shift)}>
              <EditIcon />
              編輯
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2Icon />
              刪除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <CardHeader className="gap-1">
          <CardTitle className="flex items-center text-2xl">
            <span>{shift.date}</span>
            <span className="text-sm font-normal text-muted-foreground">（{dayjs(shift.date).format("dd")}）</span>
          </CardTitle>
          <CardTitle className="flex items-center text-base gap-1">
            <MapPin className="size-4" />
            {siteKeys.find((s) => s.id === shift.siteId)?.name}
          </CardTitle>
          <CardTitle className="flex items-center text-base gap-1">
            <Clock className="size-4" />
            {shift.startTime} ～ {shift.endTime}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 min-h-14">
          {shift.attendees.map((attendee, index) => (
            <div
              key={attendee}
              className="flex items-center justify-center px-3 text-base rounded-l-full rounded-r-full bg-secondary h-7 min-w-18 gap-1 "
            >
              {shift.requiredDeliverers > 0 && index < 2 && <VanIcon />}
              {userKeys?.find((user) => user.id === attendee)?.displayName ?? "未知？"}
            </div>
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
          {!shift.isFull && (
            <Button variant="ghost" size="icon">
              <PlusCircle className="size-6" />
            </Button>
          )}
        </CardFooter>
      </Card>
      <Suspense fallback={<Loading />}>
        {editObj !== undefined && <ShiftDialog editShiftObj={editObj} onClose={() => setEditObj(undefined)} />}
      </Suspense>
      {openReport && <ReportDialog onClose={() => setOpenReport(false)} shift={shift} />}
    </React.Fragment>
  );
}
