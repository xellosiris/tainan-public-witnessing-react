import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getSites } from "@/services/sites";
import { getUserKeys } from "@/services/users";
import type { Shift } from "@/types/shift";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Clock, EditIcon, MapPin, MinusCircle, PlusCircle } from "lucide-react";
import React, { useState } from "react";
import ShiftDialog from "../dialog/ShiftDialog";

type Props = {
  shift: Shift;
};

export default function ShiftCard({ shift }: Props) {
  const [editObj, setEditObj] = useState<null | undefined | Shift>(undefined);
  const { data: userKeys } = useQuery({
    queryKey: ["userkeys"],
    queryFn: getUserKeys,
  });
  const { data: sites } = useQuery({
    queryKey: ["sites"],
    queryFn: getSites,
  });
  return (
    <React.Fragment>
      <Card className="w-78">
        <CardHeader className="gap-1.5">
          <CardTitle className="text-2xl">
            {shift.date}
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
          {/* {shift.requiredDeliverers > 0 && (
          <CardDescription>
            運送：
            {shift.attendees
              .slice(0, shift.requiredDeliverers)
              .map((a) => userKeys?.find((user) => user.id === a)?.displayName ?? "未知")
              .join("、")}
          </CardDescription>
        )} */}
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 min-h-10">
          {shift.attendees.map((attendee) => (
            <Badge key={attendee} variant={"secondary"} className="text-sm min-w-18 h-7">
              {userKeys?.find((user) => user.id === attendee)?.displayName ?? "未知"}
            </Badge>
          ))}
        </CardContent>
        <CardFooter className="justify-end">
          <Button variant="ghost" size="icon" onClick={() => setEditObj(shift)}>
            <EditIcon className="size-5" />
          </Button>
          {!shift.isFull && (
            <Button variant="ghost" size="icon">
              <PlusCircle className="size-5" />
            </Button>
          )}
          <Button variant="ghost" size="icon">
            <MinusCircle className="size-5 text-destructive" />
          </Button>
        </CardFooter>
      </Card>
      {editObj !== undefined && <ShiftDialog editShiftObj={editObj} onClose={() => setEditObj(undefined)} />}
    </React.Fragment>
  );
}
