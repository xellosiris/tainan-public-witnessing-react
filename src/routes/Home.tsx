import ShiftCard from "@/components/card/ShiftCard";
import { Label } from "@/components/ui/label";
import { getShiftsByDate } from "@/services/shifts";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

export default function Home() {
  const { data: todayShifts } = useQuery({
    queryKey: ["shifts", dayjs().format("YYYY-MM-DD")],
    queryFn: () => getShiftsByDate(dayjs().format("YYYY-MM-DD")),
  });

  const { data: tomorrowShifts } = useQuery({
    queryKey: ["shifts", dayjs().add(1, "day").format("YYYY-MM-DD")],
    queryFn: () => getShiftsByDate(dayjs().format("YYYY-MM-DD")),
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-2xl">今日班表</Label>
        <div className="flex gap-4 flex-wrap">
          {todayShifts?.map((shift) => (
            <ShiftCard key={shift.id} shift={shift} />
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-2xl">明日班表</Label>
        <div className="flex gap-4 flex-wrap">
          {tomorrowShifts?.map((shift) => (
            <ShiftCard key={shift.id} shift={shift} />
          ))}
        </div>
      </div>
    </div>
  );
}
