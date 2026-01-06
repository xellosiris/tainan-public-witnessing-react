import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getSiteKeys } from "@/services/sites";
import { getUserKeys } from "@/services/users";
import type { Shift } from "@/types/shift";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ClipboardEditIcon, Clock, EditIcon, EllipsisVerticalIcon, MapPin, PlusCircle, Trash2Icon } from "lucide-react";
import React, { useState } from "react";
import ReportDialog from "../dialog/ReportDialog";
import ShiftDialog from "../dialog/ShiftDialog";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";

type Props = {
  shift: Shift;
};

export default function ShiftCard({ shift }: Props) {
  const [openReport, setOpenReport] = useState<boolean>(false);
  const [editObj, setEditObj] = useState<null | undefined | Shift>(undefined);
  const { data: userKeys } = useQuery({
    queryKey: ["userkeys"],
    queryFn: getUserKeys,
  });
  const { data: sites } = useQuery({
    queryKey: ["siteKeys"],
    queryFn: getSiteKeys,
  });

  return (
    <React.Fragment>
      <Card className="w-full max-w-xs relative gap-4">
        <Popover>
          <PopoverTrigger className="absolute top-2 right-2" asChild>
            <Button variant="ghost" size="icon">
              <EllipsisVerticalIcon className="size-6" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col w-23 items-start p-1">
            <Button variant={"ghost"} className="font-normal w-full rounded-none" onClick={() => setEditObj(shift)}>
              <EditIcon />
              編輯
            </Button>
            <Separator />
            <Button variant={"ghost"} className="font-normal text-destructive w-full rounded-none">
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
            {sites?.find((s) => s.id === shift.siteId)?.name ?? "未知"}
          </CardTitle>
          <CardTitle className="flex items-center text-base gap-1">
            <Clock className="size-4" />
            {shift.startTime} ～ {shift.endTime}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 min-h-14">
          {shift.attendees.map((attendee) => (
            <Badge key={attendee} variant={"secondary"} className="h-7 text-sm">
              {userKeys?.find((user) => user.id === attendee)?.displayName ?? "未知"}
            </Badge>
          ))}
        </CardContent>
        <CardFooter className="flex gap-1 justify-end">
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
