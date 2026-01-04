import { getSites } from "@/services/sites";
import { getUserKeys } from "@/services/users";
import type { Shift } from "@/types/shift";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Clock, EditIcon, MapPin } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";

type Props = {
  shift: Shift;
};

export default function ShiftCard({ shift }: Props) {
  const { data: userKeys } = useQuery({
    queryKey: ["userkeys"],
    queryFn: getUserKeys,
  });
  const { data: sites } = useQuery({
    queryKey: ["sites"],
    queryFn: getSites,
  });
  return (
    <Card className="w-78">
      <CardHeader className="gap-1.5">
        <CardTitle className="text-2xl">
          {shift.date}
          <span className="text-sm text-muted-foreground font-normal">（{dayjs(shift.date).format("dd")}）</span>
        </CardTitle>
        <CardTitle className="flex gap-1 items-center text-base">
          <MapPin className="size-4" />
          {sites?.find((s) => s.id === shift.siteId)?.name ?? "未知"}
        </CardTitle>
        <CardTitle className="flex gap-1 items-center text-base">
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
        <Button variant="ghost" size="icon">
          <EditIcon className="size-5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
