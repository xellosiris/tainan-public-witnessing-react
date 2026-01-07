import ShiftCard from "@/components/card/ShiftCard";
import { Label } from "@/components/ui/label";
import { Loading } from "@/components/ui/loading";
import { getShiftsByDate } from "@/services/shifts";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

export default function Home() {
  const { data: shifts, isLoading } = useQuery({
    queryKey: ["shifts", dayjs().format("YYYY-MM-DD")],
    queryFn: () => getShiftsByDate(dayjs().format("YYYY-MM-DD")),
  });
  if (isLoading) return <Loading />;
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
