import ShiftCard from "@/components/card/ShiftCard";
import { Label } from "@/components/ui/label";
import { getShiftsByDate } from "@/services/shift";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { data: shifts } = useSuspenseQuery({
    queryKey: ["shifts", dayjs().format("YYYY-MM-DD")],
    queryFn: () => getShiftsByDate(dayjs().format("YYYY-MM-DD")),
  });
  return (
    <div className="space-y-2">
      <Label className="text-2xl">今日班表</Label>
      <div className="flex flex-wrap gap-4">
        {shifts?.map((shift) => (
          <ShiftCard key={shift.id} shift={shift} />
        ))}
      </div>
    </div>
  );
}
