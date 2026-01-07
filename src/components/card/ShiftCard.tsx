import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getSetting } from "@/services/settings";
import type { Shift } from "@/types/shift";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  ClipboardEditIcon,
  Clock,
  EditIcon,
  EllipsisVerticalIcon,
  MapPin,
  PlusCircle,
  Trash2Icon,
  VanIcon,
} from "lucide-react";
import React, { useState } from "react";
import ReportDialog from "../dialog/ReportDialog";
import ShiftDialog from "../dialog/ShiftDialog";
import { Loading } from "../ui/loading";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";

type Props = {
  shift: Shift;
};

export default function ShiftCard({ shift }: Props) {
  const [openReport, setOpenReport] = useState<boolean>(false);
  const [editObj, setEditObj] = useState<null | undefined | Shift>(undefined);
  const { data: setting, isLoading } = useQuery({
    queryKey: ["setting"],
    queryFn: getSetting,
  });

  if (isLoading) return <Loading />;
  if (!setting) return <div>找不到設定檔</div>;
  const { userKeys, siteKeys } = setting;
  return (
    <React.Fragment>
      <Card className="relative w-full max-w-xs gap-4">
        <Popover>
          <PopoverTrigger className="absolute top-2 right-2" asChild>
            <Button variant="ghost" size="icon">
              <EllipsisVerticalIcon className="size-6" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col items-start p-1 w-23">
            <Button variant={"ghost"} className="w-full font-normal rounded-none" onClick={() => setEditObj(shift)}>
              <EditIcon />
              編輯
            </Button>
            <Separator />
            <Button variant={"ghost"} className="w-full font-normal rounded-none text-destructive">
              <Trash2Icon />
              刪除
            </Button>
          </PopoverContent>
        </Popover>
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
              {userKeys?.find((user) => user.id === attendee)?.displayName}
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
      {editObj !== undefined && <ShiftDialog editShiftObj={editObj} onClose={() => setEditObj(undefined)} />}
      {openReport && <ReportDialog onClose={() => setOpenReport(false)} shift={shift} />}
    </React.Fragment>
  );
}
